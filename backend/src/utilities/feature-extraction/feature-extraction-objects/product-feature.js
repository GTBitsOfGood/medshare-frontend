const { ObjectId } = require('mongoose').Types;

class ProductFeature {
  /**
   * id of the ProductFeature document that this should point to
   * @param featureId - should be of type string
   */
  static validateFeatureId(featureId) {
    try {
      // eslint-disable-next-line no-new
      new ObjectId(featureId);
    } catch (error) {
      throw new Error('Invalid argument: The feature id is not a string that represents a mongoose id: ' + error);
    }
  }

  constructor(featureId, nameAttributeFeature, productIdAttributeFeature) {
    ProductFeature.validateFeatureId(featureId);
    this.productFeature = featureId; // mongoose feature id. todo: this should be renamed

    if (nameAttributeFeature.featureText !== productIdAttributeFeature.featureText) {
      throw new Error('Invalid arguments: The attribute features must be for the same feature text');
    }

    this.name = nameAttributeFeature;
    this.productId = productIdAttributeFeature;
    this.featureText = nameAttributeFeature.featureText;
  }
}

module.exports = ProductFeature;
