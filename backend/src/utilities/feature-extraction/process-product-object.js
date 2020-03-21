const { Product, ProductFeatures } = require('../../database/models');
const Feature = require('./feature');

const REMOVE_REGEX = new RegExp('( (?=-))|((?<=-) )|((?<=[a-zA-Z])-(?=[a-zA-Z]))|_', 'g');
const STANDARD_FEATURE_REGEX = new RegExp('([0-9][0-9"/]*[-/][0-9][0-9"/]*)|(\\w+)', 'g');
const COMMA_DELIMITED_REGEX = new RegExp('[^,\\s][^\\,]*[^,\\s]*', 'g');

const COMMA_REGEX_THRESHOLD = 2;

async function processProductObjectAndInsertIntoDB(rawProductObject) {
  const normalizedProductObject = rawProductObject.normalize();
  const features = await getProductFeatureMetadatas(normalizedProductObject);
  return Product.insertProductWithFeatures(normalizedProductObject, features);
}

async function getProductFeatureMetadatas(rawProductObject) {
  const productIdFeatures = generateIdFeatures(rawProductObject);
  const nameFeatures = generateNameFeatures(rawProductObject.name);
  return insertFeaturesAndGetMetadatasPromise(productIdFeatures, nameFeatures);
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

async function insertFeaturesAndGetMetadatasPromise(productIdFeatures, nameFeatures) {
  const metadatasWithoutId = getFeatureMetadatas(productIdFeatures, nameFeatures);
  return Promise.all(metadatasWithoutId.map(insertFeatureFromMetadataAndGetId));
}

/**
 * Basically groups features by source. One feature can exist in two sources (name and feature id) and groups them together
 * under the shared feature name
 * @param productIdFeatures - the features found in the product id
 * @param nameFeatures - the features found in the product name
 * @returns - the feature metadatas (the sources and metadata describing the feature). the feature still hasn't been inserted into the DB
 */
function getFeatureMetadatas(productIdFeatures, nameFeatures) {
  const productIdFeaturesMap = textValueToFeatureMap(productIdFeatures);
  const nameFeaturesMap = textValueToFeatureMap(nameFeatures);
  const featureValues = [...new Set([...productIdFeaturesMap.keys(), ...nameFeaturesMap.keys()])];

  return featureValues.map(featureText => {
    return {
      featureText,
      name: getFeatureOrGetEmpty(nameFeaturesMap, featureText),
      productId: getFeatureOrGetEmpty(productIdFeaturesMap, featureText)
    };
  });
}

function textValueToFeatureMap(features) {
  return new Map(features.map(feature => [feature.featureText, feature]));
}

function getFeatureOrGetEmpty(featureMap, featureText) {
  const output = { count: 0, medianIndex: -1 };
  if (featureMap.has(featureText)) {
    const feature = featureMap.get(featureText);
    output.count = feature.count;
    output.medianIndex = feature.medianPosition;
  }
  return featureMap.has(featureText) ? featureMap.get(featureText) : Feature.newEmptyFeature(featureText);
}

async function insertFeatureFromMetadataAndGetId(metadata) {
  const productFeatureDoc = await ProductFeatures.featureFound(metadata.featureText, metadata.name.count);
  metadata.productFeature = productFeatureDoc._id;
  return metadata;
}

module.exports = {
  processProductObjectAndInsertIntoDB
};
