const AWS = require('aws-sdk');
const logger = require('../config/logger');

const dynamodb = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'local',
  secretAccessKey: 'local'
});

const tables = [
  {
    TableName: 'sports-shop-api-products-dev',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'sports-shop-api-users-dev',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'sports-shop-api-carts-dev',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'sports-shop-api-orders-dev',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserIdIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
];

const createTables = async () => {
  logger.info('Creating DynamoDB tables...');

  for (const tableConfig of tables) {
    try {
      await dynamodb.describeTable({ TableName: tableConfig.TableName }).promise();
      logger.info(`Table ${tableConfig.TableName} already exists`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
        try {
          await dynamodb.createTable(tableConfig).promise();
          logger.info(`Created table: ${tableConfig.TableName}`);

          await dynamodb.waitFor('tableExists', { TableName: tableConfig.TableName }).promise();
          logger.info(`Table ${tableConfig.TableName} is ready`);
        } catch (createError) {
          logger.error(`Error creating table ${tableConfig.TableName}:`, createError.message);
          throw createError;
        }
      } else {
        logger.error(`Error checking table ${tableConfig.TableName}:`, error.message);
        throw error;
      }
    }
  }

  logger.info('All tables created successfully!');
};

if (require.main === module) {
  createTables()
    .then(() => {
      logger.info('Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
