const mongoose = require('mongoose');

const JobStatus = require('../../utilities/feature-extraction/extraction-job/job-status');

const extractionErrorSchema = {
  errorCategory: { type: String },
  errorMessage: String
};

const extractionResultSchema = {
  totalSaved: Number,
  extractionError: extractionErrorSchema
};

const fileMetadataSchema = {
  submittedFileName: { type: String, required: true },
  encoding: { type: String, required: true },
  serverFilePath: { type: String, required: true },
  fileMapping: { type: Map, of: String, required: true },
  fileType: { type: String, required: true }
};

const extractionJobSchema = new mongoose.Schema({
  requestedBy: { type: String, required: true },
  processId: { type: String, unique: false },
  requestedAt: { type: Date, required: true, default: Date.now() },
  fileMetadata: fileMetadataSchema,
  jobStatus: { type: String, required: true, default: JobStatus.STARTING },
  extractionResult: extractionResultSchema,
  finishedAt: { type: Date }
});

const ACTIVE_STATUS_FILTER = { jobStatus: { $in: JobStatus.ACTIVE_JOBS } };
/**
 * @returns {Promise<*>} a Promise of the ExtractionJob
 */
// eslint-disable-next-line func-names
extractionJobSchema.statics.getCurrentActiveJob = async function() {
  return this.findOne(ACTIVE_STATUS_FILTER).lean();
};

extractionJobSchema.statics.getMostRecentJob = async function() {
  return this.findOne()
    .sort({ requestedAt: -1 })
    .lean();
};

extractionJobSchema.statics.saveJobRequest = async function(jobRequest) {
  return this.create(jobRequest);
};

extractionJobSchema.statics.updateJobStatus = async function(jobId, newJobStatus) {
  return this.findOneAndUpdate()
    .where({ _id: jobId })
    .set('jobStatus', newJobStatus);
};

/**
 * ONLY updates if it has an active status
 * @param jobId
 * @param extractionResult
 * @returns {Promise<Query>}
 */
extractionJobSchema.statics.updateJobAsFinishedWithErrors = async function(jobId, extractionResult) {
  return this.findOneAndUpdate()
    .where({ _id: jobId })
    .where(ACTIVE_STATUS_FILTER)
    .set('jobStatus', JobStatus.FINISHED_WITH_ERRORS)
    .set('extractionResult', extractionResult)
    .set('finishedAt', Date.now());
};

/**
 *
 * ONLY updates if it has an active status
 * @param jobId
 * @param extractionResult
 * @returns {Promise<Query>}
 */
extractionJobSchema.statics.updateAsJobFinishedSuccessfully = async function(jobId, extractionResult) {
  return this.findOneAndUpdate()
    .where({ _id: jobId })
    .where(ACTIVE_STATUS_FILTER)
    .set('jobStatus', JobStatus.FINISHED_SUCCESSFULLY)
    .set('extractionResult', extractionResult)
    .set('finishedAt', Date.now());
};

const ExtractionJob = mongoose.model('ExtractionJob', extractionJobSchema);

module.exports = ExtractionJob;
