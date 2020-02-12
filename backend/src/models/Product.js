const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  productId: { type: String, required: true },
  features: [{ type: ObjectId, ref: 'ProductFeatures' }]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
