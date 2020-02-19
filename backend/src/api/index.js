const router = require('express').Router();
const searchRoutes = require('./search');

// Health check API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API is up and running!'
  });
});

router.use('/search', searchRoutes);

module.exports = router;
