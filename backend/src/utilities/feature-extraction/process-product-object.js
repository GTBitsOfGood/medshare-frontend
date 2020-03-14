const { Product, ProductFeatures } = require('../../database/models');

const REMOVE_REGEX = new RegExp('( (?=-))|((?<=-) )|((?<=[a-zA-Z])-(?=[a-zA-Z]))|_', 'g');
const STANDARD_FEATURE_REGEX = new RegExp('([0-9][0-9"/]*[-/][0-9][0-9"/]*)|(\\w+)', 'g');
const COMMA_DELIMITED_REGEX = new RegExp('[^,\\s][^\\,]*[^,\\s]*', 'g');
const COMMA_REGEX_THRESHOLD = 2;

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
  productObject.searchableName = generateSearchableName(productObject.name, features);
  productObject.features = await Promise.all(featuresPromises);
  return Product.insertProduct(productObject);
}

function extractFeaturesListsFromProductObject(productObject) {
  return {
    productId: [generateIdFeature(productObject)],
    name: extractFeaturesFromValue(productObject.name)
  };
}

function generateIdFeature(productObject) {
  return {
    featureText: `#${productObject.productId}`,
    medianIndex: 0
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
          name: [],
          productId: []
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

/**
 * Generates the string searched when matching products against a string. Features are added to the string because
 * it's possible they have been normalized--the user could be searching by the noormalized version or the unormalized
 * version
 * @param productName
 * @param featuresInProductName
 * @returns {string}
 */
function generateSearchableName(productName, searchableFeatures) {
  const searchableFeaturesString = searchableFeatures.map(feature => feature.featureLabel).join(' ');
  return productName + ' ' + searchableFeaturesString;
}

module.exports = {
  processProductObjectAndInsertIntoDB
};
