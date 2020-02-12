const mongoose = require('mongoose');
const ProductFeatures = require('./ProductFeatures');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  productId: { type: String, required: true },
  features: { type: ProductFeatures.ObjectId, required: true }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
