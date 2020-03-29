/**
 * Represents a product without any features extract from it
 */
class RawProduct {
  get name() {
    return this._name;
  }

  get productId() {
    return this._productId;
  }

  get category() {
    return this._category;
  }

  get subcategory() {
    return this._subcategory;
  }

  constructor(name, productId, category, subcategory) {
    this._name = name;
    this._productId = productId;
    this._category = category;
    this._subcategory = subcategory;
  }

  /**
   * Validates it's a valid product. It has a name, product id, category, and subcategory
   * @returns {*}
   */
  validateProductObject() {
    return this.name && this.productId && this.category && this.subcategory;
  }

  normalize() {
    return new RawProduct(
      this.name.toLowerCase(),
      this.productId,
      this.category.toLowerCase(),
      this.subcategory.toLowerCase()
    );
  }
}

module.exports = RawProduct;
