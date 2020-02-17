const mongoose = require('mongoose');

const productFeaturesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, required: true }
});

productFeaturesSchema.statics.featureFound = async function featureFound(feature, count = 1) {
  return this.findOneAndUpdate(
    {
      name: feature
    },
    {
      $inc: {
        count
      }
    },
    {
      upsert: true,
      useFindAndModify: false,
      new: true
    }
  );
};

const ProductFeatures = mongoose.model('ProductFeatures', productFeaturesSchema);

module.exports = ProductFeatures;
