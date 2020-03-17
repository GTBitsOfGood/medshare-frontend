const { Product, ProductFeatures } = require('../database/models');

const searchController = {};

const DISTANCE_FROM_POSITION_MAX = 100000;
const PAGE_SIZE = 15;
const IS_ID_FIELD = 'IS_ID';
const DIFF_FIELD = 'POSITION_DIFF';
const FREQUENCY_FIELD = 'LOCAL_FREQUENCY';

/**
 * Gets a list of features by finding all products that match the query
 * @param nameFilter - what to filter the productSearchableName by AND the featureName by
 * @param filterCategory - what to filter the category by
 * @param filterSubcategories - what to filter the subcategories by
 * @param filterFeatureIds - a list of *required* feature id's that matching products need to have
 * @returns {Promise<*|Aggregate>} a list of ProductFeature documents
 */
searchController.queryFeaturesByProducts = async (
  nameFilter,
  filterCategory,
  filterSubcategories,
  filterFeatureMongooseIds
) => {
  const inputFeatures = await ProductFeatures.getFeaturesByIds(filterFeatureMongooseIds);
  const targetFeaturePosition = getTotalLengthOfFeatures(inputFeatures);
  const filter = generateProductFilterWithRequiredFeatures(
    nameFilter,
    filterCategory,
    filterSubcategories,
    filterFeatureMongooseIds
  );
  const featureInQueryFilter = {
    productFeature: {
      $nin: filterFeatureMongooseIds
    }
  };
  const featureNameFilter = {
    name: {
      $regex: new RegExp(nameFilter, 'i')
    }
  };
  return aggregateProductFeaturesFromProducts(filter, featureInQueryFilter, featureNameFilter, targetFeaturePosition);
};

/**
 * Gets the total length of all features
 * @param features - ProductFeature documents
 * @returns the total length of all the product feature documents
 */
function getTotalLengthOfFeatures(features) {
  return features.map(feature => feature.name.length).reduce((left, right) => left + right, 0);
}

/**
 * Queries Product documents and returns the matching Product documents
 * @param productName  - must be within the product's "searchableName"
 * @param filterCategory (can be null) - the category the product must be in
 * @param filterSubcategories (array) (can be null) - the product's subcategories must fall under one of these subcategories [OR'ED]
 * @param filterFeatureIds (array of Mongoose ObjectId's) - the required feature's the product must have. If empty array, then no required features [AND'ed]
 * @returns {Promise<*>}
 */
searchController.queryProducts = async (productName, filterCategory, filterSubcategories, filterFeatureIds) => {
  const filter = generateProductFilterWithRequiredFeatures(
    productName,
    productName,
    filterSubcategories,
    filterFeatureIds
  );
  return Product.find(filter).limit(PAGE_SIZE);
};

/**
 * Generates a product filter with the parameters below
 * @param productNameFilter
 * @param filterCategory
 * @param filterSubcategories
 * @param filterFeatureIds - MUST BE of type ObjectId
 * @returns A filter matching the params
 */
function generateProductFilterWithRequiredFeatures(
  productNameFilter,
  filterCategory,
  filterSubcategories,
  filterFeatureIds
) {
  const baseFilter = generateBaseProductFilter(productNameFilter, filterCategory, filterSubcategories);
  return addProductFeatureFilter(baseFilter, filterFeatureIds);
}

/**
 * Generates a product filter with the parameters below
 * @param productFilterString - searchable name must contain
 * @param filterCategory (can be null) - the filter category (what to filter on)
 * @param filterSubCategories (can be null) (can be empty) - what the subcategories must be
 * @returns a product filter
 */
function generateBaseProductFilter(productFilterString, filterCategory, filterSubCategories) {
  const baseFilter = {
    searchableName: {
      $regex: new RegExp(productFilterString, 'i')
    }
  };
  if (filterCategory) {
    baseFilter.category = { $eq: filterCategory };
  }
  if (filterSubCategories && filterSubCategories.length > 0) {
    baseFilter.subcategory = { $in: filterSubCategories };
  }
  return baseFilter;
}

/**
 * Adds a ProductFEature filter to the inputted product feature
 * Note: No filter is applied if requireFeatureIds is empty (returns same number of products as the original filter)
 * @param filter - a product filter
 * @param requiredFeatureIds (type MongooseID) - All the inputted features must exist on the returned Product document
 * @returns A Product filter with the added feature filter
 */
function addProductFeatureFilter(filter, requiredFeatureIds) {
  if (requiredFeatureIds.length > 0) {
    const idFilters = requiredFeatureIds.map(id => {
      return { $elemMatch: generateBaseProductFeatureFilter(id) };
    });
    filter.features = { $all: idFilters };
  }
  return filter;
}

/**
 * Generates base productFeature filter for filtering through product id's in products
 * @param featureId
 * @returns {{productFeature: {$eq: *}}}
 */
function generateBaseProductFeatureFilter(featureId) {
  return { productFeature: { $eq: featureId } };
}

/**
 * Aggregates all the ProductFeature documents from the matching products
 * @param productFilter - what to filter the products on (what the product match on)
 * @param productFeatureFilter - what to filter the features in the products on (not the entire feature documents; just the nested documents inside the Product document)
 * @param featureFilter - what to filter the entire feature documents on  (what to filter the product features of matching product documents on)
 * @param targetPosition - the "target" position of the output features. Features will be returned in
 * order of how close they are to this target position. If the feature has no position associated with it (such as an id), then target position = max possible integer
 * @returns ProductFeature documents
 */
function aggregateProductFeaturesFromProducts(productFilter, productFeatureFilter, featureFilter, targetPosition) {
  return Product.aggregate()
    .match(productFilter)
    .unwind('features')
    .replaceRoot('features')
    .match(productFeatureFilter)
    .addFields(generateIsIdFieldForNestedProduct())
    .addFields({
      [DIFF_FIELD]: {
        $cond: {
          if: { $gte: ['$name.medianIndex', 0] },
          then: { $abs: { $subtract: ['$name.medianIndex', targetPosition] } },
          else: DISTANCE_FROM_POSITION_MAX // if no median index == -1, then not in name. then assume a maximum distance away
        }
      }
    }) // calculate the diff from the target position
    .group({
      _id: '$productFeature',
      [DIFF_FIELD]: { $min: '$' + DIFF_FIELD },
      [FREQUENCY_FIELD]: { $sum: 1 },
      [IS_ID_FIELD]: { $first: '$' + IS_ID_FIELD }
    }) // group matching product features. keep the one with the lowest delta
    .lookup({ from: 'productfeatures', localField: '_id', foreignField: '_id', as: 'productFeature' })
    .unwind('productFeature')
    .replaceRoot({ $mergeObjects: ['$productFeature', '$$ROOT'] }) // merge the root with the productFeature object because we want to keep the DIFF_FIELD (and maybe other calculated fields in the future)
    .project({ productFeature: 0 }) // it's attributes go merged in, remove it
    .match(featureFilter)
    .sort({ [DIFF_FIELD]: 1, [FREQUENCY_FIELD]: -1 }) // sort by position diff
    .limit(PAGE_SIZE);
}

function generateIsIdFieldForNestedProduct() {
  return {
    [IS_ID_FIELD]: {
      $cond: {
        if: { $eq: ['$productId.count', 1] }, // if the feature has a count of 1 in the product id, then it's a product id
        then: true,
        else: false
      }
    }
  };
}

module.exports = searchController;
