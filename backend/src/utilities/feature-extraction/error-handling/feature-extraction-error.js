const FeatureExtractionErrorCategory = require('./feature-extraction-error-category');

class FeatureExtractionError {
  get fileExists() {
    return this.errorCategory !== FeatureExtractionErrorCategory.NULL_FILE_BUFFER;
  }

  constructor(errorCategory, errorMessage) {
    this.errorCategory = errorCategory;
    this.errorMessage = errorMessage;
  }
}

module.exports = FeatureExtractionError;
