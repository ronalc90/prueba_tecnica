const AWS = require('aws-sdk');

const isDevelopment = process.env.NODE_ENV !== 'production';

const dynamoDBConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 3000
  }
};

if (isDevelopment) {
  dynamoDBConfig.endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
  dynamoDBConfig.accessKeyId = 'local';
  dynamoDBConfig.secretAccessKey = 'local';
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(dynamoDBConfig);

module.exports = dynamoDB;
