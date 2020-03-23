const { databaseConnectUsingEnv } = require('./database-connect');
const databaseController = require('./database-controller');
const { Product, ProductFeatures } = require('./models');

module.exports = {
  databaseConnectUsingEnv,
  databaseController,
  Product,
  ProductFeatures
};
