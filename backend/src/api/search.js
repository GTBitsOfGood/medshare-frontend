const router = require('express').Router();
const { query, validationResult } = require('express-validator');
const { ObjectId } = require('mongoose').Types;
const searchController = require('../controllers/searchController');

/*
  GET search based on query

  Gets list of Product documents whose name field matches the query text. Category and subcategory have to
  match as well if they are provided. All subcategories and/or categories
  are searched if they are not provided as search params.

  Args:
    q (str): query key word (required)
    features (str): comma-separated list of MongoObjectIDs
    category (str): query category
    subcategories (str): comma-separated list of subcategories

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
    q (str): query key word
    features (str containing Mongo object id's): comma-separated list of Mongo Object id's (required).
    category (str): query category
    subcategories (str): comma-separated list of subcategories

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

function errorOnBadValidation(req, res, next) {
  if (!validationResult(req).isEmpty()) {
    res.status(500).send(validationResult(req));
  } else {
    next();
  }
}

function arrayToLowerCaseSanitizer(values) {
  return values.map(toLowerCaseSanitizer);
}

function toLowerCaseSanitizer(value) {
  return value.toLowerCase();
}

function arrayToMongoIdsSanitizer(array) {
  try {
    return array.map(ObjectId);
  } catch (error) {
    throw new Error('Could not parse mongoose id: ' + error);
  }
}

module.exports = router;
