const fs = require('fs');
const { databaseConnectUsingEnv } = require('../database');
const { featureExtractController } = require('../utilities').featureExtraction;
require('dotenv').config();

const fileMapping = {
  name: 'ProductName',
  productId: 'ProductRef',
  category: 'Category Name',
  subcategory: 'Sub Category'
};

const fileBuffer = fs.readFileSync('./resources/medshare-data-sample-reformat.csv', 'utf-8');
const invalidMaybe = featureExtractController.validateFileForFeatureExtraction(fileBuffer, 'csv', fileMapping);
if (invalidMaybe) {
  console.log(invalidMaybe);
} else {
  databaseConnectUsingEnv();
  featureExtractController
    .extractFeaturesFromFile(fileBuffer, 'csv', fileMapping)
    .then(() => process.exit(0))
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
}
