class ExtractionJobRequest {
  constructor(requestedBy, fileMetadata, requestedAt = Date.now()) {
    this.requestedBy = requestedBy;
    this.fileMetadata = fileMetadata;
    this.requesetedAt = requestedAt;
  }
}

module.exports = ExtractionJobRequest;
