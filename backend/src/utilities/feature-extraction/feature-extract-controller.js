const { databaseController } = require('../../database');
const { parseProductsFromCsvPath } = require('./csv-feature-extractor');

async function useFeaturesFromFile(filePath, fileType, encoding) {
  // TODO: Handle concurrency
  if (!fileType.includes('csv')) {
    throw new Error(`Unsupported file type for feature extraction: ${fileType}`);
  }
  console.log('Delete existing documents...');
  await deleteExistingDocuments();
  console.log('Starting parsing...');
  const totalSaved = await parseProductsFromCsv(filePath, encoding);
  console.log(`Saved ${totalSaved} products`);
  return totalSaved;
}

async function parseProductsFromCsv(csvPath, encoding) {
  return (await parseProductsFromCsvPath(csvPath, encoding)).length;
}

async function deleteExistingDocuments() {
  console.log(`Deleted ${await databaseController.deleteAll()} products and product features`);
}

module.exports = {
  useFeaturesFromFile
};
