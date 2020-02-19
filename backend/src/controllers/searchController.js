const Product = require('../database/models/Product');

const searchController = {};

const fieldsOfInterest = ['name', 'productId'];

const PAGE_SIZE = 15;

searchController.queryProducts = async (queries, cate, sub) => {
  const searchQuery = [];
  fieldsOfInterest.forEach(field => {
    queries.forEach(query => {
      searchQuery.push({
        $and: [
          { [field]: { $regex: new RegExp(query, 'i') } },
          cate ? { category: cate } : {},
          sub ? { subcategory: sub } : {}
        ]
      });
    });
  });

  console.log(searchQuery[0].$and);

  return Product.find()
    .or(searchQuery)
    .limit(PAGE_SIZE)
    .then(products => {
      return products;
    });
};

module.exports = searchController;
