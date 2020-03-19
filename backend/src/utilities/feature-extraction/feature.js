class Feature {
  get featureText() {
    return this._featureText;
  }

  get count() {
    return this.locations.length;
  }

  get medianPosition() {
    return this.locations[Math.floor(this.locations.length / 2)];
  }

  get locations() {
    return this._locations;
  }

  constructor(featureText, locations) {
    this._featureText = featureText;
    this._locations = locations;
  }
}

module.exports = Feature;
