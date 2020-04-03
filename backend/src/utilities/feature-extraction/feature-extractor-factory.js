const csvFeatureExtractor = require('./feature-extractors/csv-feature-extractor');

/**
 * A factory to get the FeatureExtractor for an unknown file type.
 *
 * Implement `FileFeatureExtractor` for the desired file type
 * and add it to the array below to support the file type(s) for that FileFeatureExtractor
 */
const featureExtractors = [csvFeatureExtractor];

const featureExtractMapping = generateFactoryMap();
function generateFactoryMap() {
  const mapping = {};
  featureExtractors.forEach(featureExtractor => {
    featureExtractor.getSupportedFileTypes().forEach(fileType => {
      mapping[fileType] = featureExtractor;
    });
  });
  return mapping;
}

function isSupportedFileType(fileType) {
  return featureExtractMapping[fileType] != null;
}

function getFeatureExtractor(fileType) {
  if (!isSupportedFileType(fileType)) {
    throw new Error(`No feature extractor exists for file of type ${fileType}`);
  }
  return featureExtractMapping[fileType];
}

module.exports = {
  isSupportedFileType,
  getFeatureExtractor
};
