const { body } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
const router = require('express').Router();

const ProductFeatures = require('../database/models/ProductFeatures');
const { customValidation, featureExtractController } = require('../utilities');

const { errorOnBadValidation, fileUploadedValidator } = customValidation;

const DEFAULT_ENCODING = 'utf-8';
const FILE_FIELD_IN_FORM = 'productFile';
const PAGE_LIMIT = 10;

const fileUpload = multer({ dest: '/resources/product-uploads' });

/**
 * GET endpoint that returns the PAGE_LIMIT most frequent features
 */
router.get('/', async (req, res, next) => {
  try {
    const features = await ProductFeatures.find()
      .sort({
        count: -1
      })
      .limit(PAGE_LIMIT);
    res.send(features);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/product-upload', [
  fileUpload.single(FILE_FIELD_IN_FORM),
  body('', 'File upload could not be found').custom(fileUploadedValidator),
  errorOnBadValidation,
  async (req, res) => {
    const { path, mimetype } = req.file;
    try {
      const productsSaved = await featureExtractController.useFeaturesFromFile(path, mimetype, DEFAULT_ENCODING);
      res.status(200).send(`Saved ${productsSaved} products and features`);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.toString());
    }
    fs.unlink(path);
  }
]);

module.exports = router;
