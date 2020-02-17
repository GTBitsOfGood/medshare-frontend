const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  productId: { type: String, required: true, unique: true },
  features: [
    {
      _id: { id: false },
      count: { type: Number },
      productFeature: { type: ObjectId, ref: 'ProductFeatures' }
    }
  ]
});

productSchema.statics.insertProduct = async function featureFound(product) {
  return this.findOneAndUpdate(
    {
      productId: product.productId
    },
    product,
    {
      upsert: true,
      useFindAndModify: false,
      new: true
    }
  );
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
