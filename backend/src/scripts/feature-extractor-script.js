const { parseProductsFromCsvPath } = require('../utilities');
const { databaseConnectUsingEnv } = require('../database');
require('dotenv').config();

databaseConnectUsingEnv();
Promise.all(parseProductsFromCsvPath('./resources/medshare-data-sample-reformat.csv'))
  .then(results => {
    console.log(`Saved ${results.length} products`);
    process.exit(0);
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
