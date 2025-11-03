const dynamoDB = require('../config/dynamodb');
const logger = require('../config/logger');
const { getProductById } = require('./productService');

const CARTS_TABLE = process.env.DYNAMODB_CARTS_TABLE;

const getCart = async (userId) => {
  try {
    const result = await dynamoDB.get({
      TableName: CARTS_TABLE,
      Key: { userId }
    }).promise();

    if (!result.Item) {
      return {
        userId,
        items: [],
        total: 0,
        updatedAt: new Date().toISOString()
      };
    }

    return result.Item;
  } catch (error) {
    logger.error('Error getting cart:', error);
    throw error;
  }
};

const addToCart = async (userId, productId, quantity) => {
  try {
    const product = await getProductById(productId);

    if (product.stock < quantity) {
      throw new Error('Insufficient stock available');
    }

    const cart = await getCart(userId);
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error('Insufficient stock available');
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();

    await dynamoDB.put({
      TableName: CARTS_TABLE,
      Item: cart
    }).promise();

    logger.info(`Added ${quantity}x ${product.name} to cart for user ${userId}`);

    return cart;
  } catch (error) {
    logger.error('Error adding to cart:', error);
    throw error;
  }
};

const removeFromCart = async (userId, productId) => {
  try {
    const cart = await getCart(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();

    await dynamoDB.put({
      TableName: CARTS_TABLE,
      Item: cart
    }).promise();

    logger.info(`Removed product ${productId} from cart for user ${userId}`);

    return cart;
  } catch (error) {
    logger.error('Error removing from cart:', error);
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    await dynamoDB.delete({
      TableName: CARTS_TABLE,
      Key: { userId }
    }).promise();

    logger.info(`Cleared cart for user ${userId}`);
  } catch (error) {
    logger.error('Error clearing cart:', error);
    throw error;
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
