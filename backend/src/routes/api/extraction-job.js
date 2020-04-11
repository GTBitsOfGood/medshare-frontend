const { body, param } = require('express-validator');
const multer = require('multer');
const path = require('path');
const process = require('process');
const router = require('express').Router();
const { FeatureExtractionError } = require('../../utilities/feature-extraction/error-handling');

const {
  errorOnBadValidation,
  fileUploadedValidator,
  toMongooseIdSanitizer
} = require('../../utilities/custom-validation');
const { ExtractionJob } = require('../../database');
const {
  extractJobController,
  ExtractionJobRequest,
  FileMetadata
} = require('../../utilities/feature-extraction/extraction-job');
const fileController = require('../../utilities/file-controller');

const DEFAULT_FILE_ENCODING = 'utf-8';
const DEFAULT_USER_ID = 'Unknown user';
const FILE_FIELD_IN_FORM = 'productFile';
const UPLOAD_ROOT = path.join(__dirname, '../../../resources/product-uploads'); // needs to be an absolute path

const fileUpload = multer({ dest: UPLOAD_ROOT });

/**
 * Register listeners for upload cleanup. Uploaded files should be deleted when the job terminates,
 * but if the user kills his/her API session early (or there is some issue with the DB), the uploaded file will not be cleaned up in the job.
 * This is more of a 'double-check' than anything
 */
const exitHandler = () => {
  fileController.deleteAllFilesInDirectory(UPLOAD_ROOT);
  process.exit(1);
};

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);

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
      const job = await extractJobController.submit(extractionJobRequest);
      res.status(202).send(job);
    } catch (error) {
      if (error instanceof FeatureExtractionError) {
        res.status(406).send({
          message: error.errorMessage
        });
      } else {
        console.error(error);
        res.status(500).send(`Unknown error when submitting request: ${error.toString()}`);
      }
    }
  }
]);

module.exports = router;
