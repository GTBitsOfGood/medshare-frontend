const router = require('express').Router();
const searchController = require('../controllers/searchController');

/*
  GET search based on query

  checks to see if query word matches any of the attributes in Product
  more specifically ProductName, Category Name, Sub Category, ProductRef

  Args:
    q (str): query key word

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
