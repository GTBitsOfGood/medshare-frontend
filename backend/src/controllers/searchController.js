const { ObjectId } = require('mongoose').Types;
const Product = require('../database/models/Product');

const searchController = {};

const PAGE_SIZE = 15;

searchController.queryFeaturesByProducts = async (
  nameFilter,
  filterCategory,
  filterSubcategories,
  filterFeatureIds
) => {
  const filterFeatureMongooseIds = filterFeatureIds.map(ObjectId);
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
  return Product.aggregate()
    .match(filter)
    .unwind('features')
    .replaceRoot('features')
    .match(featureInQueryFilter)
    .group({ _id: '$productFeature' })
    .lookup({ from: 'productfeatures', localField: '_id', foreignField: '_id', as: 'productFeature' })
    .unwind('productFeature')
    .replaceRoot('productFeature')
    .match(featureNameFilter)
    .sort({ count: -1 })
    .limit(PAGE_SIZE);
};

searchController.queryProducts = async (productNameFilter, filterCategory, filterSubcategories, filterFeatureIds) => {
  const filterFeatureMongooseIds = filterFeatureIds.map(ObjectId);
  const filter = generateProductFilterWithRequiredFeatures(
    productNameFilter,
    filterCategory,
    filterSubcategories,
    filterFeatureMongooseIds
  );
  return Product.find()
    .or(filter)
    .limit(PAGE_SIZE);
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
    baseFilter.category = { $eq: filterCategory.toLowerCase() };
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

function generateBaseProductFeatureFilter(featureId) {
  return { productFeature: { $eq: featureId } };
}

module.exports = searchController;
