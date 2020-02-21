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
router.get('/', async (req, res) => {
  const { q, category, subcategories } = req.query;
  if (q === null || typeof q !== 'string') {
    console.log('error');
    return res.status(400).send('Query word must exist!');
  }
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
    return res.status(500).send(err);
  }
});

module.exports = router;
