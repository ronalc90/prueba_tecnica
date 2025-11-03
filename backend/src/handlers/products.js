const { productQuerySchema } = require('../models/schemas');
const { listProducts, getProductById } = require('../services/productService');
const { success, error } = require('../utils/response');
const logger = require('../config/logger');

const list = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};

    const { error: validationError, value } = productQuerySchema.validate(queryParams);
    if (validationError) {
      return error(validationError.details[0].message, 400);
    }

    const result = await listProducts(value);

    logger.info(`Listed products: ${result.products.length} items`);

    return success(result);
  } catch (err) {
    logger.error('Error listing products:', err);
    return error(err.message || 'Failed to list products', 500);
  }
};

const get = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
      return error('Product ID is required', 400);
    }

    const product = await getProductById(id);

    logger.info(`Retrieved product: ${id}`);

    return success(product);
  } catch (err) {
    logger.error('Error getting product:', err);
    const statusCode = err.message === 'Product not found' ? 404 : 500;
    return error(err.message || 'Failed to get product', statusCode);
  }
};

module.exports = {
  list,
  get
};
