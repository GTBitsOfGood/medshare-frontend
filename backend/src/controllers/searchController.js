const { Product, ProductFeatures } = require('../database/models');

const searchController = {};

const PAGE_SIZE = 15;
const DIFF_FIELD = 'POSITION_DIFF';
const FREQUENCY_FIELD = 'LOCAL_FREQUENCY';

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

function getTotalLengthOfFeatures(features) {
  return features.map(feature => feature.name.length).reduce((left, right) => left + right, 0);
}

searchController.queryProducts = async (productNameFilter, filterCategory, filterSubcategories, filterFeatureIds) => {
  const filter = generateProductFilterWithRequiredFeatures(
    productNameFilter,
    filterCategory,
    filterSubcategories,
    filterFeatureIds
  );
  return Product.find(filter).limit(PAGE_SIZE);
};

/**
 *
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

function generateBaseProductFilter(productFilterString, filterCategory, filterSubCategories) {
  const baseFilter = {
    name: {
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
 * Note: No filter is applied if requireFeatureIds is empty (returns same number of products as the original filter)
 * @param filter
 * @param requiredFeatureIds - MUST be of type MongooseId
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
 *
 * @param productFilter - what to filter the products on
 * @param productFeatureFilter - what to filter the features in the products on (not the entire feature documents;
 * the nested feature metadata
 * @param featureFilter - what to filter the entire feature documents on
 * @param targetPosition - the "target" position of the output features. Features will be returned in
 * order of how close they are to this target position
 * @returns {*|Aggregate}
 */
function aggregateProductFeaturesFromProducts(productFilter, productFeatureFilter, featureFilter, targetPosition) {
  return Product.aggregate()
    .match(productFilter)
    .unwind('features')
    .replaceRoot('features')
    .match(productFeatureFilter)
    .addFields({ [DIFF_FIELD]: { $abs: { $subtract: ['$name.medianIndex', targetPosition] } } }) // calculate the diff from the target position
    .group({
      _id: '$productFeature',
      [DIFF_FIELD]: { $min: '$' + DIFF_FIELD },
      [FREQUENCY_FIELD]: { $sum: 1 }
    }) // group matching product features. keep the one with the lowest delta
    .lookup({ from: 'productfeatures', localField: '_id', foreignField: '_id', as: 'productFeature' })
    .unwind('productFeature')
    .replaceRoot({ $mergeObjects: ['$productFeature', '$$ROOT'] }) // merge the root with the productFeature object because we want to keep the DIFF_FIELD (and maybe other calculated fields in the future)
    .project({ productFeature: 0 }) // it's attributes go merged in, remove it
    .match(featureFilter)
    .sort({ [DIFF_FIELD]: 1, [FREQUENCY_FIELD]: -1 }) // sort by position diff
    .limit(PAGE_SIZE);
}

module.exports = searchController;
