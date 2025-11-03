const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../config/dynamodb');
const logger = require('../config/logger');

const ORDERS_TABLE = process.env.DYNAMODB_ORDERS_TABLE;

const createOrder = async (userId, userEmail, items, total, shippingAddress, paymentMethod) => {
  try {
    const orderId = uuidv4();

    const order = {
      id: orderId,
      userId,
      userEmail,
      items,
      total,
      shippingAddress,
      paymentMethod,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    await dynamoDB.put({
      TableName: ORDERS_TABLE,
      Item: order
    }).promise();

    logger.info(`Order created: ${orderId} for user ${userId}`);

    return order;
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const result = await dynamoDB.query({
      TableName: ORDERS_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise();

    return result.Items || [];
  } catch (error) {
    logger.error('Error getting orders:', error);
    throw error;
  }
};

const getOrderById = async (orderId) => {
  try {
    const result = await dynamoDB.get({
      TableName: ORDERS_TABLE,
      Key: { id: orderId }
    }).promise();

    return result.Item || null;
  } catch (error) {
    logger.error('Error getting order:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById
};
