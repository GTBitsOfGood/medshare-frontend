const { Product, ProductFeatures } = require('./models');

async function deleteAll() {
  const deleteCounts = await Promise.all([Product.deleteAll(), ProductFeatures.deleteAll()]);
  return deleteCounts.reduce((a, b) => a + b, 0);
}

module.exports = {
  deleteAll
};
