const { databaseController } = require('../../database');
const { ExtractionResult, FeatureExtractionError, FeatureExtractionErrorCategory } = require('./error-handling');
const featureExtractFactory = require('./feature-extractor-factory');
const rawProductProcessor = require('./raw-product-processor');

const PRINT_UPDATE_MESSAGE_EVERY = 50;

/**
 * Validates file. If valid, delete existing features and extract features from the file
 * @param fileBuffer - the file buffer to extract the features from
 * @param fileType - the file type
 * @param mapping - the file attribute mapping
 * @returns {Promise<ExtractionResult>}
 */
async function validateFileAndExtractFeatures(fileBuffer, fileType, mapping) {
  const errorMaybe = validateFileForFeatureExtraction(fileBuffer, fileType, mapping);
  if (errorMaybe) {
    return new ExtractionResult(0, errorMaybe);
  }
  return extractFeaturesFromFile(fileBuffer, fileType, mapping);
}

/**
 * Validates file at file path. If a valid file, it will extract the features from the file
 * @param fileBuffer - the file buffer
 * @param fileType - the file type (csv for example)
 * @param mapping - the mapping of file fields to productObject fields
 * @returns FeatureExtractionErrorCategory if invalid. Null otherwise
 */
function validateFileForFeatureExtraction(fileBuffer, fileType, mapping) {
  if (fileBuffer == null) {
    return new FeatureExtractionError(FeatureExtractionErrorCategory.NULL_FILE_BUFFER, 'The file could not be found');
  }
  if (!featureExtractFactory.isSupportedFileType(fileType)) {
    return new FeatureExtractionError(
      FeatureExtractionErrorCategory.INVALID_FILE,
      `Unsupported file type for feature extraction: ${fileType}`
    );
  }
  const fileFeatureExtractor = featureExtractFactory.getFeatureExtractor(fileType, mapping);
  return fileFeatureExtractor.validateFile(fileBuffer, mapping);
}

/**
 * Delete existing features and extract features from the file
 * @param fileBuffer - the file buffer to extract the features from
 * @param fileType - the file type
 * @param mapping - the file attribute mapping
 * @returns {Promise<ExtractionResult>}
 */
async function extractFeaturesFromFile(fileBuffer, fileType, mapping) {
  const fileFeatureExtractor = featureExtractFactory.getFeatureExtractor(fileType);
  console.log('Delete existing documents...');
  await deleteExistingDocuments();

  console.log('Starting parsing...');
  const productObjects = fileFeatureExtractor
    .extractRawProducts(fileBuffer, mapping)
    .filter(rawProduct => rawProduct.validateProductObject);
  const extractionResult = await extractFeaturesFromRawProducts(productObjects);

  console.log(`Saved ${extractionResult.totalSaved} products`);
  return extractionResult;
}

async function deleteExistingDocuments() {
  console.log(`Deleted ${await databaseController.deleteAll()} products and product features`);
}

async function extractFeaturesFromRawProducts(productObjects) {
  for (let count = 0; count < productObjects.length; count += 1) {
    if ((count + 1) % PRINT_UPDATE_MESSAGE_EVERY === 0) {
      const setNumber = parseInt((count + 1) / PRINT_UPDATE_MESSAGE_EVERY, 10);
      console.log(`${setNumber}. Inserted ${PRINT_UPDATE_MESSAGE_EVERY} objects into database`);
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      await rawProductProcessor.processRawProductAndInsertIntoDB(productObjects[count]); // temp solution because running concurrently has issues with upsert and update because it's a nonatomic operation
    } catch (error) {
      const featureExtractionError = new FeatureExtractionError(
        FeatureExtractionErrorCategory.UNKNOWN_ERROR_WHILE_EXTRACTING,
        error.toString()
      );
      return new ExtractionResult(0, featureExtractionError);
    }
  }
  return new ExtractionResult(productObjects.length, null);
}

module.exports = {
  validateFileAndExtractFeatures,
  validateFileForFeatureExtraction,
  extractFeaturesFromFile
};
