/**
 * An abstraction for a product file type.
 * A strategy for validating and extracting products/product features for
 * the file type
 */
class FileFeatureExtractor {
  /**
   * Returns the file type(s) this FileFeatureExtractor supports
   *
   * Returns an array of strings
   */
  // eslint-disable-next-line class-methods-use-this
  getSupportedFileTypes() {
    throw new Error(`Unimplemented ${this}`);
  }

  /**
   * Checks to see if the file is valid
   * @param fileBuffer - the file buffer
   * @param mapping - the mapping of keys in the file to product object keys
   * Returns feature-extraction-error if invalid file
   */
  // eslint-disable-next-line class-methods-use-this
  validateFile(fileBuffer, mapping) {
    throw new Error(`Unimplemented: ${fileBuffer}, ${mapping}, ${this}`);
  }

  /**
   * Extract raw products from file. See RawProduct.js
   * @param fileBuffer - the file buffer
   * @param mapping - the mapping of keys in the file to product object keys
   */
  // eslint-disable-next-line class-methods-use-this
  extractRawProducts(fileBuffer, mapping) {
    throw new Error(`Unimplemented: ${fileBuffer}, ${mapping}, ${this}`);
  }
}
module.exports = FileFeatureExtractor;
