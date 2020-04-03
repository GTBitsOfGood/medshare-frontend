const mongoose = require('mongoose');

const JobStatus = require('../../utilities/feature-extraction/extraction-job/job-status');

const STALE_JOB_THRESHOLD = 10000; // (ms) if a job hasn't pinged in the last 10 seconds, it will be marked as stale

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
  requestedAt: { type: Date, required: true, default: Date.now },
  fileMetadata: fileMetadataSchema,
  jobStatus: { type: String, required: true, default: JobStatus.STARTING },
  extractionResult: extractionResultSchema,
  lastHealthPing: { type: Date, required: true, default: Date.now },
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

extractionJobSchema.statics.pingAsAlive = async function(jobId) {
  return this.findOneAndUpdate()
    .where({ _id: jobId })
    .set('lastHealthPing', Date.now());
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

/**
 *
 * Marks jobs as stale that haven't recently made their heatlh check ping. This essentially
 * 'cleans' up jobs that were terminated before they reached completion. As a result, "re-opening"
 * the extraction job lock.
 *
 * Currently, this function will be called on 'find' hooks but we might want to change it to a chron job
 */
extractionJobSchema.statics.findAndMarkStaleJobs = async function() {
  const thresholdDate = Date.now() - STALE_JOB_THRESHOLD;
  return this.updateMany()
    .where(ACTIVE_STATUS_FILTER)
    .where({ lastHealthPing: { $lt: thresholdDate } })
    .set('jobStatus', JobStatus.STALE)
    .set('extractionResult', null);
};
extractionJobSchema.pre('find', async function() {
  await ExtractionJob.findAndMarkStaleJobs();
});
extractionJobSchema.pre('findOne', async function() {
  await ExtractionJob.findAndMarkStaleJobs();
});

const ExtractionJob = mongoose.model('ExtractionJob', extractionJobSchema);

module.exports = ExtractionJob;
