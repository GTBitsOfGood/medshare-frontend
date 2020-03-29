class AttributeFeature {
  static newEmptyFeature(featureText) {
    return new AttributeFeature(featureText, []);
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
    this.count = this.locations.length; // a public property for the database
    this.medianIndex = this.getHolisticLocation(); // a public property for the database
  }

  getHolisticLocation() {
    return this.locations.length > 0 ? this.locations[Math.floor(this.locations.length / 2)] : -1;
  }
}

module.exports = AttributeFeature;
