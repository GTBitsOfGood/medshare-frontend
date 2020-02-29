const { parseProductsFromCsvPath, processProductObjectAndInsertIntoDB } = require('./feature-extractor');
const pluralize = require('./pluralize-library');

module.exports = {
  parseProductsFromCsvPath,
  pluralize,
  processProductObjectAndInsertIntoDB
};
