const router = require('express').Router();
const searchController = require('../controllers/searchController');

/*
  GET search based on query

  Gets list of Product documents whose name field matches the query text. Category and subcategory have to
  match as well if they are provided. All subcategories and/or categories
  are searched if they are not provided as search params.

  Args:
    q (str): query key word (required)
    category (str): query category
    subcategories (str): comma-separate list of subcategories

  Returns:
    array of all matching products
 */
router.get('/', ensureParameterInRequest('q', 'string'), async (req, res) => {
  const { q, category, subcategories } = req.query;
  const queries = q.toLowerCase().split(' ');
  let subcategoriesArr = null;
  if (subcategories) {
    subcategoriesArr = subcategories.toLowerCase().split(',');
  }
  try {
    const products = await searchController.queryProducts(queries, category.toLowerCase(), subcategoriesArr);
    return res.send(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

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
  ensureParameterInRequest('q', 'string'),
  ensureParameterInRequest('features', 'string'),
  async (req, res) => {
    const { q, category, subcategories, features } = req.query;
    const featuresArray = features
      .toLowerCase()
      .split(',')
      .filter(feature => feature.length > 0);
    let subcategoriesArr = null;
    if (subcategories) {
      subcategoriesArr = subcategories.toLowerCase().split(',');
    }
    try {
      const outputFeatures = await searchController.queryFeaturesByProducts(
        q.toLowerCase(),
        category.toLowerCase(),
        subcategoriesArr,
        featuresArray
      );
      return res.send(outputFeatures);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  }
);

function ensureParameterInRequest(parameterName, desiredType) {
  return (req, res, next) => {
    const value = req.query[parameterName];
    // eslint-disable-next-line valid-typeof
    if (value === null || typeof value !== desiredType) {
      console.log('error when parsing parameters from req');
      res.status(400).send(`${parameterName} must be a query param and be of type ${desiredType}!`);
    } else {
      next();
    }
  };
}
module.exports = router;
