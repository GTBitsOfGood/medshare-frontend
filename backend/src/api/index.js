const router = require('express').Router();
const extractionJobRoutes = require('./extraction-job');
const searchRoutes = require('./search');
const featuresRoutes = require('./features');

// Health check API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API is up and running!'
  });
});

router.use('/extraction-job', extractionJobRoutes);
router.use('/search', searchRoutes);
router.use('/features', featuresRoutes);

module.exports = router;
