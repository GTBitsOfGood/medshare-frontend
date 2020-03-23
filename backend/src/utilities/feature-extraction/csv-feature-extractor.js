const fs = require('fs');
const Papa = require('papaparse');

const RawProduct = require('./raw-product');
const { processProductObjectAndInsertIntoDB } = require('./process-product-object');

const DEFAULT_FILE_ENCODING = 'utf-8';
const PRINT_UPDATE_MESSAGE_EVERY = 50;

const DEFAULT_CSV_PRODUCT_MAPPING = {
  name: 'ProductName',
  productId: 'ProductRef',
  category: 'Category Name',
  subcategory: 'Sub Category'
};

function parseProductsFromCsvPath(filePath, encoding = DEFAULT_FILE_ENCODING, mapping = DEFAULT_CSV_PRODUCT_MAPPING) {
  const fileBuffer = fs.readFileSync(filePath, encoding);
  return parseProductsFromCsv(fileBuffer, mapping);
}

function parseProductsFromCsv(fileBuffer, mapping) {
  const result = Papa.parse(fileBuffer, {
    header: true,
    skipEmptyLines: true
  });
  const expectedFieldsInCsv = Object.values(mapping);
  if (!checkForExpectedFields(result.meta.fields, expectedFieldsInCsv)) {
    throw new Error(
      `The CSV was parsed and did not contain the expected ` +
        `fields. Expected: ${expectedFieldsInCsv}. Found: ${result.fields}`
    );
  }
  return processCsvResultObjects(result.data, mapping);
}

function checkForExpectedFields(resultFields, expectedFields) {
  return expectedFields.every(field => resultFields.includes(field));
}

async function processCsvResultObjects(csvResultObjects, mapping) {
  const validCsvObjects = csvResultObjects
    .map(csvObject => csvObjectToProductObject(csvObject, mapping))
    .filter(productObject => productObject.validateProductObject());
  for (let count = 0; count < validCsvObjects.length; count += 1) {
    if ((count + 1) % PRINT_UPDATE_MESSAGE_EVERY === 0) {
      const setNumber = parseInt((count + 1) / PRINT_UPDATE_MESSAGE_EVERY, 10);
      console.log(`${setNumber}. Inserted ${PRINT_UPDATE_MESSAGE_EVERY} objects into database`);
    }
    // eslint-disable-next-line no-await-in-loop
    await processProductObjectAndInsertIntoDB(validCsvObjects[count]); // temp solution because running concurrently has issues with upsert and update because it's a nonatomic operation
  }
}

function csvObjectToProductObject(csvObject, mapping) {
  const name = csvObject[mapping.name];
  const productId = csvObject[mapping.productId];
  const category = csvObject[mapping.category];
  const subscategory = csvObject[mapping.subcategory];
  return new RawProduct(name, productId, category, subscategory);
}

module.exports = {
  parseProductsFromCsvPath
};
