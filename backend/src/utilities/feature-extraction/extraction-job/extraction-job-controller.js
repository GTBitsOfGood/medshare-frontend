const { fork } = require('child_process');
const path = require('path');

const { ExtractionJob } = require('../../../database');
const featureExtractController = require('../feature-extract-controller');
const { FeatureExtractionError, FeatureExtractionErrorCategory } = require('../error-handling');

const EXTRACTION_CHILD_PROCESS_PATH = path.join(
  path.dirname(require.main.filename),
  '/utilities/feature-extraction/extraction-job/extraction-job-child-process.js'
); // assumes you're running from backend src root

async function submit(extractionJobRequest) {
  if (await isThereJobRunning()) {
    return new FeatureExtractionError(
      FeatureExtractionErrorCategory.JOB_CURRENTLY_RUNNING,
      'There is a job currently running'
    );
  }

  const validationErrorMaybe = validateFile(extractionJobRequest.fileMetadata);
  if (validationErrorMaybe) {
    return validationErrorMaybe;
  }

  return submitJob(extractionJobRequest);
}

async function isThereJobRunning() {
  return !!(await ExtractionJob.getCurrentActiveJob()); // TODO: Return back to true once complete
}

function validateFile(fileMetadata) {
  const { fileBuffer, fileType, fileMapping } = fileMetadata;

  return featureExtractController.validateFileForFeatureExtraction(fileBuffer, fileType, fileMapping);
}

/**
 * Submit the job. Assumes job has been validated
 * @param extractionJobRequest - the job request
 * @returns {Promise<null>}
 */
async function submitJob(extractionJobRequest) {
  const jobDocumentPromise = ExtractionJob.saveJobRequest(extractionJobRequest);
  spawnJobChildProcess(jobDocumentPromise);
  return jobDocumentPromise;
}

async function spawnJobChildProcess(jobDocumentPromise) {
  const jobId = (await jobDocumentPromise)._id;
  fork(EXTRACTION_CHILD_PROCESS_PATH, [jobId]);
}

module.exports = {
  submit
};
