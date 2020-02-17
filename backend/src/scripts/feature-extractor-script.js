const { parseProductsFromCsvPath } = require('../utilities');
const { databaseConnectUsingEnv } = require('../database');
require('dotenv').config();

databaseConnectUsingEnv();
console.log('Starting parsing...');
const insertPromise = Promise.all(parseProductsFromCsvPath('./resources/medshare-data-sample-reformat.csv'));
console.log('All values parsed... Waiting to for DB promises to resolve');
insertPromise
  .then(results => {
    console.log(`Saved ${results.length} products`);
    process.exit(0);
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
