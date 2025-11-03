const { addToCartSchema } = require('../models/schemas');
const { getCart, addToCart, removeFromCart } = require('../services/cartService');
const { authMiddleware } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const logger = require('../config/logger');

const get = authMiddleware(async (event) => {
  try {
    const userId = event.user.userId;
    const cart = await getCart(userId);

    logger.info(`Retrieved cart for user: ${userId}`);

    return success(cart);
  } catch (err) {
    logger.error('Error getting cart:', err);
    return error(err.message || 'Failed to get cart', 500);
  }
});

const add = authMiddleware(async (event) => {
  try {
    const userId = event.user.userId;
    const body = JSON.parse(event.body);

    const { error: validationError } = addToCartSchema.validate(body);
    if (validationError) {
      return error(validationError.details[0].message, 400);
    }

    const { productId, quantity } = body;
    const cart = await addToCart(userId, productId, quantity);

    logger.info(`Added to cart for user: ${userId}`);

    return success(cart);
  } catch (err) {
    logger.error('Error adding to cart:', err);
    return error(err.message || 'Failed to add to cart', 500);
  }
});

const remove = authMiddleware(async (event) => {
  try {
    const userId = event.user.userId;
    const { productId } = event.pathParameters;

    if (!productId) {
      return error('Product ID is required', 400);
    }

    const cart = await removeFromCart(userId, productId);

    logger.info(`Removed from cart for user: ${userId}`);

    return success(cart);
  } catch (err) {
    logger.error('Error removing from cart:', err);
    return error(err.message || 'Failed to remove from cart', 500);
  }
});

module.exports = {
  get,
  add,
  remove
};
