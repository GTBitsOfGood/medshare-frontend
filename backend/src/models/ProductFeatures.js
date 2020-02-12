const mongoose = require('mongoose');

const productFeaturesSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Count: { type: Number, required: true }
});

const ProductFeatures = mongoose.model(
  'ProductFeatures',
  productFeaturesSchema
);
module.exports = ProductFeatures;
