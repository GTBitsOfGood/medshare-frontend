class Feature {
  static newEmptyFeature(featureText) {
    return new Feature(featureText, []);
  }

  get featureText() {
    return this._featureText;
  }

  get locations() {
    return this._locations;
  }

  constructor(featureText, locations) {
    this._featureText = featureText;
    this._locations = locations;
    this.count = this.locations.length;
    this.medianIndex = this.getMedianIndex();
  }

  getMedianIndex() {
    return this.locations > 0 ? this.locations[Math.floor(this.locations.length / 2)] : -1;
  }
}

module.exports = Feature;
