const mongoose = require('mongoose');

const DUPE_KEY_ERROR = 11000;
const MAX_RETRIES = 100;
const RETRY_TIMEOUT = 10;

const productFeaturesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, required: true }
});

productFeaturesSchema.statics.featureFound = async function featureFound(featureLabel, count = 1, recursionDepth = 0) {
  return this.findOneAndUpdate(
    {
      name: featureLabel
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
  ).catch(error => updateFeatureErrorHandler(this, error, featureLabel, count, recursionDepth));
};

async function updateFeatureErrorHandler(db, error, featureLabel, count, recursionDepth) {
  let returnPromise;
  if (error.code === DUPE_KEY_ERROR && recursionDepth < MAX_RETRIES) {
    await wait(RETRY_TIMEOUT);
    returnPromise = db.featureFound(db, featureLabel, count, recursionDepth + 1);
  } else {
    console.trace(error);
    returnPromise = Promise.reject(error);
  }
  return returnPromise;
}

function wait(timeInMilli) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, timeInMilli);
  });
}

const ProductFeatures = mongoose.model('ProductFeatures', productFeaturesSchema);

module.exports = ProductFeatures;
