class ExtractionResult {
  get hasError() {
    return this.extractionError != null;
  }

  constructor(totalSaved, extractionErrorMaybe) {
    this.totalSaved = totalSaved;
    this.extractionError = extractionErrorMaybe;
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports = ExtractionResult;
