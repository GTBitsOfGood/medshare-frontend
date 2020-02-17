const fs = require('fs');
const Papa = require('papaparse');
const { Product, ProductFeatures } = require('../database/models');

const DEFAULT_CSV_PRODUCT_MAPPING = {
  ProductRef: 'productId',
  ProductName: 'name',
  'Category Name': 'category',
  'Sub Category': 'subcategory'
};
const FEATURE_REGEX = new RegExp([' ', '/', '-', '&', '\\*', '"', ',', '\\\\'].join('|'), 'g');
const FILE_ENCODING = 'utf-8';
const PRODUCT_OBJECT_KEYS = ['productId', 'name', 'category', 'subcategory'];

function parseProductsFromCsvPath(filePath, mapping = DEFAULT_CSV_PRODUCT_MAPPING) {
  const fileBuffer = fs.readFileSync(filePath, FILE_ENCODING);
  return parseProductsFromCsv(fileBuffer, mapping);
}

function parseProductsFromCsv(fileBuffer, mapping) {
  const result = Papa.parse(fileBuffer, { header: true });
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

function processCsvResultObjects(csvResultObjects, mapping) {
  return csvResultObjects
    .map(csvObject => csvObjectToProductObject(csvObject, mapping))
    .filter(validateProductObject)
    .map(processProductObjectAndInsertIntoDB);
}

function csvObjectToProductObject(csvObject, mapping) {
  const productObject = {};
  Object.entries(mapping).forEach(([csvKey, productKey]) => {
    productObject[productKey] = csvObject[csvKey];
  });
  return productObject;
}

function validateProductObject(productObject) {
  return PRODUCT_OBJECT_KEYS.reduce((accumulator, expectedKey) => {
    let currentObjectValid = true;
    if (productObject[expectedKey] === undefined || productObject[expectedKey] instanceof String) {
      console.log(`Missing key ${expectedKey} in ${JSON.stringify(productObject)}`);
      currentObjectValid = false;
    }
    return accumulator && currentObjectValid;
  }, true);
}

async function processProductObjectAndInsertIntoDB(productObject) {
  const featuresList = extractFeaturesListFromProductObject(productObject);
  const featuresCount = countFeatures(featuresList);
  const featuresPromises = featuresCount.map(([feature, count]) => insertFeatureIntoDatabase(feature, count));
  productObject.features = await Promise.all(featuresPromises);
  return Product.insertProduct(productObject);
}

function extractFeaturesListFromProductObject(productObject) {
  return []
    .concat(extractFeaturesFromValue(productObject.name))
    .concat(extractFeaturesFromValue(productObject.category))
    .concat(extractFeaturesFromValue(productObject.subcategory));
}

function extractFeaturesFromValue(value) {
  const lowerCaseValue = value.toLowerCase();
  return lowerCaseValue
    .split(FEATURE_REGEX)
    .map(string => string.trim())
    .filter(string => string.length > 0);
}

function countFeatures(featureList) {
  const countMap = {};
  if (featureList.length > 0) {
    featureList.reduce((accumulator, feature) => {
      if (countMap[feature] == null) {
        countMap[feature] = 0;
      }
      countMap[feature] += 1;
      return countMap;
    });
  }

  return Object.entries(countMap);
}

async function insertFeatureIntoDatabase(feature, countInObject) {
  const dbObject = await ProductFeatures.featureFound(feature, countInObject);
  // eslint-disable-next-line no-underscore-dangle
  return { productFeature: dbObject._id, count: countInObject };
}

module.exports = {
  parseProductsFromCsvPath,
  processProductObjectAndInsertIntoDB
};
