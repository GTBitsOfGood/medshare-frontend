const { Product, ProductFeatures } = require('./models');
const { databaseConnectUsingEnv } = require('./database-connect');

module.exports = {
  databaseConnectUsingEnv,
  Product,
  ProductFeatures
};
