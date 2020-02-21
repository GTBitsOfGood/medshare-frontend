const Product = require('../database/models/Product');

const searchController = {};

const PAGE_SIZE = 15;

searchController.queryProducts = async (queries, filterCategory, filterSubcategories) => {
  const searchQuery = queries.map(query => {
    const baseQuery = {
      $and: [{ name: { $regex: new RegExp(query, 'i') } }]
    };
    if (filterCategory) {
      baseQuery.$and.push({ category: { $eq: filterCategory } });
    }
    if (filterSubcategories) {
      baseQuery.$and.push({ subcategory: { $in: filterSubcategories } });
    }
    return baseQuery;
  });

  return Product.find()
    .or(searchQuery)
    .limit(PAGE_SIZE);
};

module.exports = searchController;
