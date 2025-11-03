const AWS = require('aws-sdk');
const logger = require('../config/logger');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'local',
  secretAccessKey: 'local'
});

const PRODUCTS_TABLE = 'sports-shop-api-products-dev';

const clearProducts = async () => {
  try {
    logger.info('Scanning products table...');

    const result = await dynamoDB.scan({
      TableName: PRODUCTS_TABLE
    }).promise();

    logger.info(`Found ${result.Items.length} products to delete`);

    for (const item of result.Items) {
      await dynamoDB.delete({
        TableName: PRODUCTS_TABLE,
        Key: { id: item.id }
      }).promise();
      logger.info(`Deleted product: ${item.name}`);
    }

    logger.info('All products deleted!');
  } catch (error) {
    logger.error('Error clearing products:', error);
    throw error;
  }
};

if (require.main === module) {
  clearProducts()
    .then(() => {
      logger.info('Clear completed!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Clear failed:', error);
      process.exit(1);
    });
}

module.exports = { clearProducts };
