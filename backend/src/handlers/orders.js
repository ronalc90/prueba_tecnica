const { getOrdersByUserId } = require('../services/orderService');
const { authMiddleware } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const logger = require('../config/logger');

const list = authMiddleware(async (event) => {
  try {
    const userId = event.user.userId;
    const orders = await getOrdersByUserId(userId);

    logger.info(`Retrieved ${orders.length} orders for user: ${userId}`);

    return success(orders);
  } catch (err) {
    logger.error('Error listing orders:', err);
    return error(err.message || 'Failed to list orders', 500);
  }
});

module.exports = {
  list
};
