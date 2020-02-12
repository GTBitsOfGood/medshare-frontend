const mongoose = require('mongoose');

const productFeaturesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true }
});

const ProductFeatures = mongoose.model(
  'ProductFeatures',
  productFeaturesSchema
);
module.exports = ProductFeatures;
