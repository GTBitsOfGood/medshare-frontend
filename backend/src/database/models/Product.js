const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const featureDataSchema = {
  _id: { id: false },
  count: Number,
  medianIndex: Number
};

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  searchableName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  productId: { type: String, required: true, unique: true },
  features: [
    {
      _id: { id: false },
      productFeature: { type: ObjectId, ref: 'ProductFeatures' },
      name: featureDataSchema,
      productId: featureDataSchema
    }
  ]
});

productSchema.statics.insertProductWithFeatures = async function insertProduct(productObject, features) {
  const searchableName = generateSearchableName(productObject.name, features);
  await this.create({
    name: productObject.name,
    searchableName,
    productId: productObject.productId,
    category: productObject.category,
    subcategory: productObject.subcategory,
    features
  });
};

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

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
