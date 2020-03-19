const { Product, ProductFeatures } = require('../../database/models');
const Feature = require('./feature');

const REMOVE_REGEX = new RegExp('( (?=-))|((?<=-) )|((?<=[a-zA-Z])-(?=[a-zA-Z]))|_', 'g');
const STANDARD_FEATURE_REGEX = new RegExp('([0-9][0-9"/]*[-/][0-9][0-9"/]*)|(\\w+)', 'g');
const COMMA_DELIMITED_REGEX = new RegExp('[^,\\s][^\\,]*[^,\\s]*', 'g');

const COMMA_REGEX_THRESHOLD = 2;

async function processProductObjectAndInsertIntoDB(rawProductObject) {
  const features = await getProductFeatures(rawProductObject);
  return Product.insertProductWithFeatures(rawProductObject, features);
}

async function getProductFeatures(rawProductObject) {
  const features = groupFeaturesByValue(
    generateIdFeatures(rawProductObject),
    generateNameFeatures(rawProductObject.name)
  );
  const featuresPromises = features.map(async feature => {
    const featureId = await insertFeatureIntoDatabase(feature);
    // reference the feature id, not the name in the database
    delete feature.featureLabel;
    feature.productFeature = featureId;
    return feature;
  });
  return Promise.all(featuresPromises);
}

function generateIdFeatures(productObject) {
  return [new Feature(`#${productObject.productId}`, [0])];
}

function generateNameFeatures(value) {
  /* normalize any special characters/spaces that might effect feature matching.
   offset map required to ensure "median index" is based off unnormalized string
   */
  const normalizedValue = removeSpecialCharacters(value.toLowerCase());
  const featureRegex =
    (normalizedValue.match(COMMA_DELIMITED_REGEX) || []).length >= COMMA_REGEX_THRESHOLD
      ? COMMA_DELIMITED_REGEX
      : STANDARD_FEATURE_REGEX;
  const normalizedFeatureStrings = extractFeatureStringsByRegex(normalizedValue, featureRegex).map(
    normalizeFeatureAfterExtraction
  );
  return getFeaturesFromFeatureStrings(normalizedFeatureStrings);
}

function removeSpecialCharacters(value) {
  let matchResult = REMOVE_REGEX.exec(value);
  while (matchResult !== null) {
    const removeIndex = matchResult.index;
    value = value.substring(0, removeIndex) + value.substring(removeIndex + 1, value.length).trim();
    matchResult = REMOVE_REGEX.exec(value);
  }
  return value;
}

function extractFeatureStringsByRegex(value, regex) {
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

function getFeaturesFromFeatureStrings(featureStrings) {
  const featurePositionsMap = getFeaturePositionsMap(featureStrings);
  return generateFeaturesFromFeaturesPositionMap(featurePositionsMap);
}

function getFeaturePositionsMap(featureStrings) {
  const locationsByFeatureTextMap = {};
  let offset = 0;
  featureStrings.forEach(featureText => {
    if (locationsByFeatureTextMap[featureText] == null) {
      locationsByFeatureTextMap[featureText] = [];
    }
    locationsByFeatureTextMap[featureText].push(offset);
    offset += featureText.length;
  });

  return locationsByFeatureTextMap;
}

function generateFeaturesFromFeaturesPositionMap(featurePositionsMap) {
  return Object.keys(featurePositionsMap).map(featureText => {
    const positions = featurePositionsMap[featureText];
    return new Feature(featureText, positions);
  });
}

function groupFeaturesByValue(productIdFeatures, nameFeatures) {
  const productIdFeaturesMap = featuresByValue(productIdFeatures);
  const nameFeaturesMap = featuresByValue(nameFeatures);
  const featureValues = [...new Set([...productIdFeaturesMap.keys(), ...nameFeaturesMap.keys()])];

  return featureValues.map(featureText => {
    return {
      featureLabel: featureText,
      name: getFeatureOrUseDefault(nameFeaturesMap, featureText),
      productId: getFeatureOrUseDefault(productIdFeaturesMap, featureText)
    };
  });
}

function featuresByValue(features) {
  return new Map(features.map(feature => [feature.featureText, feature]));
}

function getFeatureOrUseDefault(featureMap, featureText) {
  const output = { count: 0, medianIndex: -1 };
  if (featureMap.has(featureText)) {
    const feature = featureMap.get(featureText);
    output.count = feature.count;
    output.medianIndex = feature.medianPosition;
  }
  return output;
}

async function insertFeatureIntoDatabase(feature) {
  const dbObject = await ProductFeatures.featureFound(feature.featureLabel, feature[feature.name.count]);
  // eslint-disable-next-line no-underscore-dangle
  return dbObject._id;
}

module.exports = {
  processProductObjectAndInsertIntoDB
};
