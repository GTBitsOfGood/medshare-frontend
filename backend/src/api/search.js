const router = require('express').Router();
const searchController = require('../controllers/searchController');

/*
  GET search based on query

  Checks to see if query word matches any of the attributes in Product
  more specifically name, productId. Category and subcategory have to
  match as well if they are provided. All subcategories and/or categories
  are searched if they are not provided as search params.

  Args:
    q (str): query key word
    cate (str): query category
    sub (str): query subcategory

  Returns:
    array of all matching products
 */
router.get('/search', async (req, res) => {
  const { q, cate, sub } = req.query;
  if (q === null || typeof q !== 'string') {
    console.log('error');
    return res.status(400).send('Query word must exist!');
  }
  const queries = q.split(' ');
  try {
    const products = await searchController.queryProducts(queries, cate, sub);
    return res.send(products);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
