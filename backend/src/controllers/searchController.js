const Product = require('../models/Product');

const searchController = {};

const fieldsOfInterest = ['name', 'productId'];

searchController.queryProducts = async (queries, cate, sub) => {
  const searchQuery = [];
  fieldsOfInterest.forEach(field => {
    queries.forEach(query => {
      searchQuery.push({
        $and: [
          { [field]: { $regex: new RegExp(query, 'i') } },
          { category: cate },
          { subcategory: sub }
        ]
      });
    });
  });

  console.log(searchQuery[0].$and[0]);

  return Product.find()
    .or(searchQuery)
    .then(products => {
      return products;
    });
};

module.exports = searchController;
