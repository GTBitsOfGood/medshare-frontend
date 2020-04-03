const Papa = require('papaparse');

const { FeatureExtractionError, FeatureExtractionErrorCategory, RawProduct } = require('../feature-extraction-objects');

function getSupportedFileTypes() {
  return ['csv'];
}

function validateFile(fileBuffer, mapping) {
  const expectedFieldsInCsv = Object.values(mapping);
  const result = Papa.parse(fileBuffer, {
    header: true,
    skipEmptyLines: true,
    preview: 1
  });
  const csvHeaderFields = result.meta.fields;
  return checkForExpectedFields(csvHeaderFields, expectedFieldsInCsv);
}

/**
 * @param fileHeaderFields
 * @param expectedFields
 * @returns FeatureExtractionErrorCategory if expected fields are not found. Null otherwise
 */
function checkForExpectedFields(fileHeaderFields, expectedFields) {
  let output = null;
  const missingFields = expectedFields.filter(expectedField => !fileHeaderFields.includes(expectedField));
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(', ');
    output = new FeatureExtractionError(
      FeatureExtractionErrorCategory.INVALID_FILE,
      `Missing field(s): ${missingFieldsString}`
    );
  }
  return output;
}

function extractRawProducts(fileBuffer, mapping) {
  const result = Papa.parse(fileBuffer, {
    header: true,
    skipEmptyLines: true
  });
  return result.data.map(csvObject => csvObjectToProductObject(csvObject, mapping));
}

function csvObjectToProductObject(csvObject, mapping) {
  const name = csvObject[mapping.name];
  const productId = csvObject[mapping.productId];
  const category = csvObject[mapping.category];
  const subscategory = csvObject[mapping.subcategory];
  return new RawProduct(name, productId, category, subscategory);
}

module.exports = {
  getSupportedFileTypes,
  validateFile,
  extractRawProducts
};
