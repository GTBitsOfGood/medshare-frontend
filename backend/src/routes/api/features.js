const router = require('express').Router();
const ProductFeatures = require('../../database/models/ProductFeatures');

const PAGE_LIMIT = 10;

/**
 * GET endpoint that returns the PAGE_LIMIT most frequent features
 */
router.get('/', async (req, res, next) => {
  try {
    const features = await ProductFeatures.aggregate()
      .match({ minMedianIndex: { $gte: 0 } })
      .addFields({ averagePosition: { $divide: ['$medianIndexSum', '$productsWithFeatureCount'] } })
      .sort({
        averagePosition: 1,
        count: -1
      })
      .project('name') // only keep the name
      .limit(PAGE_LIMIT);
    res.send(features);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
