const router = require('express').Router();
const searchController = require('../controllers/searchController');

/*
  GET search based on query

  Gets list of Product documents whose name field matches the query text. Category and subcategory have to
  match as well if they are provided. All subcategories and/or categories
  are searched if they are not provided as search params.

  Args:
    q (str): query key word
    category (str): query category
    subcategories (str): comma-separate list of subcategories

  Returns:
    array of all matching products
 */
router.get('/', ensureParameterInRequest('q', 'string'), async (req, res) => {
  const { q, category, subcategories } = req.query;
  const queries = q.split(' ');
  let subcategoriesArr = null;
  if (subcategories) {
    subcategoriesArr = subcategories.split(',');
  }
  try {
    const products = await searchController.queryProducts(queries, category, subcategoriesArr);
    return res.send(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});
router.get(
  '/autocomplete',
  ensureParameterInRequest('q', 'string'),
  ensureParameterInRequest('features', 'string'),
  async (req, res) => {
    const { q, category, subcategories, features } = req.query;
    const queries = q.split(' ');
    const featuresArray = features.split(',');
    let subcategoriesArr = null;
    if (subcategories) {
      subcategoriesArr = subcategories.split(',');
    }
    try {
      const outputFeatures = await searchController.queryFeaturesByProducts(
        queries,
        category,
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
