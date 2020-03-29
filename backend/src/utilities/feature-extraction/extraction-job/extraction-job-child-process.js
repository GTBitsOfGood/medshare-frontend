const fs = require('fs');
const process = require('process');

const { databaseConnectUsingEnv, ExtractionJob } = require('../../../database');
const featureExtractController = require('../feature-extract-controller');
const { FileMetadata } = require('../extraction-job');
const JobStatus = require('./job-status');
const { toMongooseIdSanitizer } = require('../../custom-validation');
// The async code that runs when parsing products. Run indpendently of the node process for the API
require('dotenv').config();

try {
  databaseConnectUsingEnv();

  const jobId = process.argv[2];

  if (jobId == null || jobId === undefined) {
    killJobBecauseUnexpectedError('Received a job with a null id');
  }
  extractFeaturesForJobId(jobId).catch(killJobBecauseUnexpectedError);
} catch (error) {
  killJobBecauseUnexpectedError(error);
}

/**
 * Extracts features for the job id
 * @param jobId}
 */
async function extractFeaturesForJobId(jobId) {
  try {
    const jobMongooseId = toMongooseIdSanitizer(jobId);
    console.log(`Starting feature extraction process for job request of ${jobId}`);

    const jobRequest = await ExtractionJob.findById(jobMongooseId).lean(true);

    if (jobRequest == null) {
      killJobBecauseUnexpectedError(`The job request with id ${jobId} could not be found in the database`);
    }
    await extractFeaturesForJobRequestAndUpdateDB(jobMongooseId, jobRequest);
  } catch (error) {
    killJobBecauseUnexpectedError(error);
  }
}

/**
 *
 * @param jobMongooseId
 * @param jobRequest
 * @returns {Promise<ExtractionResult>} - Returns extraction result for job request
 */
async function extractFeaturesForJobRequestAndUpdateDB(jobMongooseId, jobRequest) {
  console.log(`Found job request with id: ${jobMongooseId}`);
  ExtractionJob.updateJobStatus(jobMongooseId, JobStatus.RUNNING);

  const fileMetadata = FileMetadata.fromMongooseDocumentMetadata(jobRequest.fileMetadata);
  const result = await featureExtractController.validateFileAndExtractFeatures(
    fileMetadata.fileBuffer,
    fileMetadata.fileType,
    fileMetadata.fileMapping
  );
  processExtractionResult(jobRequest, result);
}

function processExtractionResult(job, extractionResult) {
  if (extractionResult.hasError) {
    processErrorResult(job, extractionResult);
  } else {
    processSuccessfulResult(job, extractionResult);
  }
}

async function processErrorResult(job, extractionResult) {
  await ExtractionJob.updateJobAsFinishedWithErrors(job._id, extractionResult);
  console.log('Job completed with errors:');
  console.log(extractionResult.toString());
  gracefullyExit(job, extractionResult);
}

async function processSuccessfulResult(job, extractionResult) {
  await ExtractionJob.updateAsJobFinishedSuccessfully(job._id, extractionResult);
  console.log('Job completed sucessfully:');
  console.log(extractionResult.toString());
  gracefullyExit(job, extractionResult);
}

function gracefullyExit(job, extractionResult) {
  if (!extractionResult.hasError || extractionResult.extractionError.fileExists) {
    fs.unlinkSync(job.fileMetadata.serverFilePath);
  }
  console.log(`Deleted user uploaded file. Gracefully exiting.`);
  process.exit(0);
}

/**
 * We're killing the job because of an unexpected error. If this method is called, then there is
 * no valid job id to update the job status wit
 * @param error - the error
 */
function killJobBecauseUnexpectedError(error) {
  console.error(error);
  console.log(`Killing job: ${error.toString()}`);
  process.exit(1);
}
