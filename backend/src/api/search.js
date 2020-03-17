const router = require('express').Router();
const { query } = require('express-validator');
const {
  toLowerCaseSanitizer,
  arrayToLowerCaseSanitizer,
  arrayToMongoIdsSanitizer,
  errorOnBadValidation
} = require('../utilities').customValidation;
const searchController = require('../controllers/searchController');

/*
  GET search based on query

  Gets list of Product documents whose name field matches the query text. Category and subcategory have to
  match as well if they are provided. All subcategories and/or categories
  are searched if they are not provided as search params.

  Args:
    q (str) (required): query key word
    features (array containing Mongoose ObjectId's): IDs of features to search by
    category (str): query category
    subcategories (array of strings): names of query subcategories

  Returns:
    array of all matching products
 */
router.get(
  '/',
  [
    query('q')
      .exists()
      .bail()
      .customSanitizer(toLowerCaseSanitizer),
    query('subcategories')
      .toArray()
      .customSanitizer(arrayToLowerCaseSanitizer),
    query('features')
      .toArray()
      .customSanitizer(arrayToMongoIdsSanitizer),
    query('category')
      .optional()
      .customSanitizer(toLowerCaseSanitizer),
    errorOnBadValidation
  ],
  async (req, res) => {
    const { q, subcategories, category, features } = req.query;
    try {
      return res.send(await searchController.queryProducts(q, category, subcategories, features));
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  }
);

/*
  GET autocomplete endpoint

  Gets list of ProductFeatures from Products that match the arguments filter. Note: Any ProductFeature's
  provided in the features query string must all be in a Product document's features array for it to "match."
  The returned ProductFeatures documents are all ProductFeatures within the matching Product document(s) minus the input
  ProductFeatures set.
  
  Note: If the provides features array is empty (empty string), then all ProductFeatures will be returned
  from Product documents matching the other supplied parameters

  Args:
    q (str) (required): query key word
    features (array containing Mongo ObjectId's): IDs of features to search by
    category (str): query category
    subcategories (array of strings): query subcategories

  Returns:
    array of ProductFeature documents
 */
router.get(
  '/autocomplete',
  [
    query('q')
      .exists()
      .bail()
      .customSanitizer(toLowerCaseSanitizer),
    query('subcategories')
      .toArray()
      .customSanitizer(arrayToLowerCaseSanitizer),
    query('features')
      .toArray()
      .customSanitizer(arrayToMongoIdsSanitizer),
    query('category')
      .optional()
      .customSanitizer(toLowerCaseSanitizer),
    errorOnBadValidation
  ],
  async (req, res) => {
    const { q, category, subcategories, features } = req.query;
    try {
      res.send(await searchController.queryFeaturesByProducts(q, category, subcategories, features));
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
