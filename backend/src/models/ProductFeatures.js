const MONGOOSE = require('mongoose');

const productFeaturesSchema = new MONGOOSE.Schema({
  Name: { type: String, required: true },
  Count: { type: Number, required: true }
});

const ProductFeatures = MONGOOSE.model(
  'ProductFeatures',
  productFeaturesSchema
);
module.exports = ProductFeatures;
