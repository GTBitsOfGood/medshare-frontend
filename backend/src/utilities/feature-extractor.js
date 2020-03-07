const fs = require('fs');
const Papa = require('papaparse');
const { Product, ProductFeatures } = require('../database/models');

const FILE_ENCODING = 'utf-8';
const PRODUCT_OBJECT_KEYS = ['productId', 'name', 'category', 'subcategory'];
const PRINT_UPDATE_MESSAGE_EVERY = 50;

const DEFAULT_CSV_PRODUCT_MAPPING = {
  ProductRef: 'productId',
  ProductName: 'name',
  'Category Name': 'category',
  'Sub Category': 'subcategory'
};

const REMOVE_REGEX = new RegExp('( (?=-))|((?<=-) )|((?<=[a-zA-Z])-(?=[a-zA-Z]))|_', 'g');
const STANDARD_FEATURE_REGEX = new RegExp('([0-9][0-9"/]*[-/][0-9][0-9"/]*)|(\\w+)', 'g');
const COMMA_DELIMITED_REGEX = new RegExp('[^,\\s][^\\,]*[^,\\s]*', 'g');
const COMMA_REGEX_THRESHOLD = 2;

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

async function processProductObjectAndInsertIntoDB(productObject) {
  const featuresListsDict = extractFeaturesListsFromProductObject(productObject);
  const features = groupAndExtractMetadata(featuresListsDict);
  const featuresPromises = features.map(async feature => {
    const featureId = await insertFeatureIntoDatabase(feature);
    // reference the feature id, not the name in the database
    delete feature.featureLabel;
    feature.productFeature = featureId;
    return feature;
  });
  productObject.features = await Promise.all(featuresPromises);
  return Product.insertProduct(productObject);
}

function extractFeaturesListsFromProductObject(productObject) {
  return {
    name: extractFeaturesFromValue(productObject.name)
  };
}

function extractFeaturesFromValue(value) {
  /* normalize any special characters/spaces that might effect feature matching.
   offset map required to ensure "median index" is based off unnormalized string
   */
  const normalizedValue = removeSpecialCharacterst(value.toLowerCase());
  const featureRegex =
    (normalizedValue.match(COMMA_DELIMITED_REGEX) || []).length >= COMMA_REGEX_THRESHOLD
      ? COMMA_DELIMITED_REGEX
      : STANDARD_FEATURE_REGEX;
  const normalizedFeatures = extractFeaturesByRegex(normalizedValue, featureRegex).map(normalizeFeatureAfterExtraction);
  return calculateStartIndexOfNormalizedFeatures(normalizedFeatures);
}

function removeSpecialCharacterst(value) {
  let matchResult = REMOVE_REGEX.exec(value);
  while (matchResult !== null) {
    const removeIndex = matchResult.index;
    value = value.substring(0, removeIndex) + value.substring(removeIndex + 1, value.length).trim();
    matchResult = REMOVE_REGEX.exec(value);
  }
  return value;
}

function extractFeaturesByRegex(value, regex) {
  const features = [];
  let matchResult = regex.exec(value);
  while (matchResult !== null) {
    const startIndex = matchResult.index;
    const feature = value.substring(startIndex, regex.lastIndex).trim();
    features.push(feature);
    matchResult = regex.exec(value);
  }
  return features.filter(feature => feature.length > 0);
}

function normalizeFeatureAfterExtraction(feature) {
  // currently not used but will probably be used in the future
  return feature;
}

function calculateStartIndexOfNormalizedFeatures(features) {
  let offset = 0;
  return features.map(featureText => {
    const startIndex = offset;
    offset += featureText.length;
    return { featureText, startIndex };
  });
}

function groupAndExtractMetadata(featuresListsDict) {
  const featuresMap = {};
  Object.entries(featuresListsDict).forEach(([source, featuresFromSource]) => {
    groupFeatures(source, featuresFromSource, featuresMap);
  });
  return Object.entries(featuresMap).map(([featureText, featureDict]) => buildFeatureObject(featureText, featureDict));
}

function groupFeatures(source, featureList, featureMap) {
  if (featureList.length > 0) {
    featureList.forEach(feature => {
      const { featureText, startIndex } = feature;
      if (featureMap[featureText] == null) {
        featureMap[featureText] = {
          name: []
        };
      }
      featureMap[featureText][source].push(startIndex);
    });
  }
}

function buildFeatureObject(featureText, featureDict) {
  const outputFeatureObject = { featureLabel: featureText };
  Object.entries(featureDict).forEach(([source, positions]) => {
    positions.sort();
    outputFeatureObject[source] = {
      count: positions.length,
      medianIndex: positions.length === 0 ? -1 : positions[Math.floor(positions.length / 2)]
    };
  });
  return outputFeatureObject;
}

async function insertFeatureIntoDatabase(feature) {
  const dbObject = await ProductFeatures.featureFound(feature.featureLabel, feature[feature.name.count]);
  // eslint-disable-next-line no-underscore-dangle
  return dbObject._id;
}

module.exports = {
  parseProductsFromCsvPath,
  processProductObjectAndInsertIntoDB
};
