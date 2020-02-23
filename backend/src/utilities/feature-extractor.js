const fs = require('fs');
const Papa = require('papaparse');
const { Product, ProductFeatures } = require('../database/models');

const DEFAULT_CSV_PRODUCT_MAPPING = {
  ProductRef: 'productId',
  ProductName: 'name',
  'Category Name': 'category',
  'Sub Category': 'subcategory'
};
const FEATURE_REGEX = new RegExp('\\w+', 'g');
const FILE_ENCODING = 'utf-8';
const PRODUCT_OBJECT_KEYS = ['productId', 'name', 'category', 'subcategory'];
const PRINT_UPDATE_MESSAGE_EVERY = 50;
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
      console.log(`Inserted ${PRINT_UPDATE_MESSAGE_EVERY} objects into database`);
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
    name: extractFeaturesFromValue(productObject.name),
    category: extractFeaturesFromValue(productObject.category),
    subcategory: extractFeaturesFromValue(productObject.subcategory)
  };
}

function extractFeaturesFromValue(value) {
  const lowerCaseValue = value.toLowerCase();
  const features = [];
  let matchResult = FEATURE_REGEX.exec(lowerCaseValue);
  while (matchResult !== null) {
    const startIndex = matchResult.index;
    const feature = lowerCaseValue.substring(startIndex, FEATURE_REGEX.lastIndex).trim();
    features.push({ featureText: feature, startIndex });
    matchResult = FEATURE_REGEX.exec(lowerCaseValue);
  }
  return features.filter(({ featureText }) => featureText.length > 0);
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
    featureList.reduce((accumulator, feature) => {
      const { featureText, startIndex } = feature;
      if (featureMap[featureText] == null) {
        featureMap[featureText] = {
          name: [],
          category: [],
          subcategory: []
        };
      }
      featureMap[featureText][source].push(startIndex);
      return featureMap;
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
