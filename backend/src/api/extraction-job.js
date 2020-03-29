const { body, param } = require('express-validator');
const multer = require('multer');
const path = require('path');
const router = require('express').Router();

const {
  errorOnBadValidation,
  fileUploadedValidator,
  toMongooseIdSanitizer
} = require('../utilities/custom-validation');
const { ExtractionJob } = require('../database');
const {
  extractJobController,
  ExtractionJobRequest,
  FileMetadata
} = require('../utilities/feature-extraction/extraction-job');

const DEFAULT_FILE_ENCODING = 'utf-8';
const DEFAULT_USER_ID = 'Unknown user';
const FILE_FIELD_IN_FORM = 'productFile';
const UPLOAD_ROOT = path.join(__dirname, '../../resources/product-uploads'); // needs to be an absolute path

const fileUpload = multer({ dest: UPLOAD_ROOT });

// TODO: LIVENESS PING, CLEAR FILES IN RESOURCE FOLDER ON EXIT (could also be used to identify stale jobs)

/**
 * Gets the most recent job (might be active)
 */
router.get('/mostRecent', async (req, res) => {
  return res.send(await ExtractionJob.getMostRecentJob());
});

/**
 * Gets the ExtractionJob by the ID
 */
router.get('/:jobId', [
  param('jobId').customSanitizer(toMongooseIdSanitizer),
  errorOnBadValidation,
  async (req, res) => {
    try {
      res.send(await ExtractionJob.findById(req.params.jobId).lean());
    } catch (error) {
      console.log(error);
      res.status(422).send(error.toString());
    }
  }
]);

/**
 * Returns 202 if successful and the ExtractionJob document if successful. If unsuccessful (406), it will return a FeatureExtractionError.js
 * with a category (FeatureExtractionErrorCategory enum) and an optional message
 */
router.post('/submit-job', [
  fileUpload.single(FILE_FIELD_IN_FORM),
  body('', 'File upload could not be found').custom(fileUploadedValidator),
  errorOnBadValidation,
  async (req, res) => {
    const { originalname } = req.file;
    const absolutePath = req.file.path;

    const fileMetadata = new FileMetadata(originalname, DEFAULT_FILE_ENCODING, absolutePath);
    const extractionJobRequest = new ExtractionJobRequest(DEFAULT_USER_ID, fileMetadata);
    try {
      const requestErrorMaybe = await extractJobController.submit(extractionJobRequest);
      if (requestErrorMaybe) {
        res.status(406).send(requestErrorMaybe);
      } else {
        res.status(202);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Unknown error when submitting request: ${error.toString()}`);
    }
  }
]);

module.exports = router;
