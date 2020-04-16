const { Product, ProductFeatures } = require('../../database/models');
const AttributeFeature = require('./feature-extraction-objects/attribute-feature');
const ProductFeature = require('./feature-extraction-objects/product-feature');

const REMOVE_REGEX = new RegExp('( (?=-))|((?<=-) )|((?<=[a-zA-Z])-(?=[a-zA-Z]))|_', 'g');
const STANDARD_FEATURE_REGEX = new RegExp('([0-9][0-9"/]*[-/][0-9][0-9"/]*)|(\\w+)', 'g');
const COMMA_DELIMITED_REGEX = new RegExp('[^,\\s][^\\,]*[^,\\s]*', 'g');

const COMMA_REGEX_THRESHOLD = 2;

async function processRawProductAndInsertIntoDB(rawProductObject) {
  const normalizedProductObject = rawProductObject.normalize();
  const features = await getProductFeatures(normalizedProductObject);
  return Product.insertProductWithFeatures(normalizedProductObject, features);
}

async function getProductFeatures(rawProductObject) {
  const productIdAttributeFeatures = generateIdAttributeFeatures(rawProductObject);
  const nameAttributeFeatures = generateNameAttributeFeatures(rawProductObject.name);
  return Promise.all(getProductFeaturesPromises(productIdAttributeFeatures, nameAttributeFeatures));
}

function generateIdAttributeFeatures(productObject) {
  return [new AttributeFeature(`#${productObject.productId}`, [0])];
}

function generateNameAttributeFeatures(value) {
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
  return getAttributeFeaturesFromFeatureStrings(normalizedFeatureStrings);
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

function getAttributeFeaturesFromFeatureStrings(featureStrings) {
  const featurePositionsMap = getFeaturePositionsMap(featureStrings);
  return generateAttributeFeaturesFromFeaturesPositionMap(featurePositionsMap);
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

function generateAttributeFeaturesFromFeaturesPositionMap(featurePositionsMap) {
  return Object.keys(featurePositionsMap).map(featureText => {
    const positions = featurePositionsMap[featureText];
    return new AttributeFeature(featureText, positions);
  });
}

/**
 * Basically groups features by source. One feature can exist in two sources (name and feature id) and groups
 * them together
 * under the shared feature name
 * @param productIdFeatures - the features found in the product id
 * @param nameFeatures - the features found in the product name
 * @returns Promise<ProductFeature>[] (the sources and metadata describing the feature).
 * we still don't have the feature id in the DB
 */
function getProductFeaturesPromises(productIdFeatures, nameFeatures) {
  const productIdFeaturesMap = textValueToFeatureMap(productIdFeatures);
  const nameFeaturesMap = textValueToFeatureMap(nameFeatures);
  const featureValues = [...new Set([...productIdFeaturesMap.keys(), ...nameFeaturesMap.keys()])];

  return featureValues.map(featureText => {
    const nameAttributeFeature = getFeatureOrGetEmpty(nameFeaturesMap, featureText);
    const productIdAttributeFeature = getFeatureOrGetEmpty(productIdFeaturesMap, featureText);
    return getProductFeaturePromise(nameAttributeFeature, productIdAttributeFeature);
  });
}

function textValueToFeatureMap(features) {
  return new Map(features.map(feature => [feature.featureText, feature]));
}

function getFeatureOrGetEmpty(featureMap, featureText) {
  return featureMap.has(featureText) ? featureMap.get(featureText) : AttributeFeature.newEmptyFeature(featureText);
}

async function getProductFeaturePromise(nameAttrFeature, productIdAttrFeature) {
  const featureId = (
    await ProductFeatures.featureFound(
      nameAttrFeature.featureText,
      nameAttrFeature.count,
      nameAttrFeature.getHolisticLocation()
    )
  )._id;
  return new ProductFeature(featureId, nameAttrFeature, productIdAttrFeature);
}

module.exports = {
  processRawProductAndInsertIntoDB
};
