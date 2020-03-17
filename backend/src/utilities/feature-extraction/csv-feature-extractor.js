const fs = require('fs');
const Papa = require('papaparse');
const { processProductObjectAndInsertIntoDB } = require('./process-product-object');

const FILE_ENCODING = 'utf-8';
const PRODUCT_OBJECT_KEYS = ['productId', 'name', 'category', 'subcategory'];
const PRINT_UPDATE_MESSAGE_EVERY = 50;

const DEFAULT_CSV_PRODUCT_MAPPING = {
  ProductRef: 'productId',
  ProductName: 'name',
  'Category Name': 'category',
  'Sub Category': 'subcategory'
};

function parseProductsFromCsvPath(filePath, mapping = DEFAULT_CSV_PRODUCT_MAPPING) {
  const fileBuffer = fs.readFileSync(filePath, FILE_ENCODING);
  return parseProductsFromCsv(fileBuffer, mapping);
}

function parseProductsFromCsv(fileBuffer, mapping) {
  const result = Papa.parse(fileBuffer, {
    header: true,
    skipEmptyLines: true
  });
  const requiredFields = Object.keys(mapping);
  if (!checkForExpectedFields(result.meta.fields, requiredFields)) {
    throw new Error(
      `The CSV was parsed and did not contain the expected ` +
        `fields. Expected: ${requiredFields}. Found: ${result.fields}`
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
    .filter(validateProductObject);
  const productPromises = [];
  for (let count = 0; count < validCsvObjects.length; count += 1) {
    if ((count + 1) % PRINT_UPDATE_MESSAGE_EVERY === 0) {
      const setNumber = parseInt((count + 1) / PRINT_UPDATE_MESSAGE_EVERY, 10);
      console.log(`${setNumber}. Inserted ${PRINT_UPDATE_MESSAGE_EVERY} objects into database`);
    }
    const productPromise = processProductObjectAndInsertIntoDB(validCsvObjects[count]);
    // eslint-disable-next-line no-await-in-loop
    await productPromise; // temp solution to dupe key issue
    productPromises.push(productPromise);
  }
  return Promise.all(productPromises);
}

function csvObjectToProductObject(csvObject, mapping) {
  const productObject = {};
  Object.entries(mapping).forEach(([csvKey, productKey]) => {
    productObject[productKey] = csvObject[csvKey].toLowerCase();
  });
  return productObject;
}

function validateProductObject(productObject) {
  return PRODUCT_OBJECT_KEYS.reduce((accumulator, expectedKey) => {
    let currentObjectValid = true;
    if (productObject[expectedKey] === undefined || productObject[expectedKey] instanceof String) {
      console.log(
        `WARNING: Missing key ${expectedKey} in ${JSON.stringify(
          productObject
        )}. It was filtered out from feature parsing.`
      );
      currentObjectValid = false;
    }
    return accumulator && currentObjectValid;
  }, true);
}
module.exports = {
  parseProductsFromCsvPath
};
