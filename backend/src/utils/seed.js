const AWS = require('aws-sdk');
const logger = require('../config/logger');
const productsData = require('./seeds/products.json');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'local',
  secretAccessKey: 'local',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000
  }
});

const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'sports-shop-api-products-dev';

const seedProducts = async () => {
  try {
    logger.info('Starting to seed products...');

    for (const product of productsData) {
      try {
        const productWithImage = {
          ...product
        };

        try {
          await dynamoDB.put({
            TableName: PRODUCTS_TABLE,
            Item: productWithImage
          }).promise();

          logger.info(`✓ Seeded product: ${product.name}`);
        } catch (dbError) {
          logger.error(`Failed to insert ${product.name} to DynamoDB:`, dbError.message);
          throw dbError;
        }
      } catch (error) {
        logger.error(`Error seeding product ${product.name}:`, error.message);
        throw error;
      }
    }

    logger.info(`\n✓ Successfully seeded ${productsData.length} products!`);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedProducts().then(() => {
    logger.info('Seed completed!');
    process.exit(0);
  }).catch(error => {
    logger.error('Seed failed:', error);
    process.exit(1);
  });
}

module.exports = { seedProducts };
