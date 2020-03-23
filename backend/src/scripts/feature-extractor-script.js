const { databaseConnectUsingEnv } = require('../database');
const { featureExtractController } = require('../utilities');
require('dotenv').config();

databaseConnectUsingEnv();
featureExtractController
  .useFeaturesFromFile('./resources/medshare-data-sample-reformat.csv', 'csv', 'utf-8')
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
