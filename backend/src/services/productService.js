const dynamoDB = require('../config/dynamodb');
const logger = require('../config/logger');

const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE;

const listProducts = async (filters = {}) => {
  try {
    const { category, page = 1, limit = 10, search } = filters;
    const offset = (page - 1) * limit;

    let params = {
      TableName: PRODUCTS_TABLE
    };

    if (category) {
      params.IndexName = 'CategoryIndex';
      params.KeyConditionExpression = 'category = :category';
      params.ExpressionAttributeValues = {
        ':category': category
      };
    }

    const result = category
      ? await dynamoDB.query(params).promise()
      : await dynamoDB.scan(params).promise();

    let items = result.Items || [];

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }

    const total = items.length;
    const paginatedItems = items.slice(offset, offset + limit);

    logger.info(`Listed ${paginatedItems.length} products (total: ${total})`);

    return {
      products: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error listing products:', error);
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const result = await dynamoDB.get({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId }
    }).promise();

    if (!result.Item) {
      throw new Error('Product not found');
    }

    return result.Item;
  } catch (error) {
    logger.error('Error getting product:', error);
    throw error;
  }
};

const updateProductStock = async (productId, quantity) => {
  try {
    const product = await getProductById(productId);

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const result = await dynamoDB.update({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId },
      UpdateExpression: 'SET stock = stock - :quantity',
      ExpressionAttributeValues: {
        ':quantity': quantity
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    logger.info(`Product ${productId} stock updated: -${quantity}`);

    return result.Attributes;
  } catch (error) {
    logger.error('Error updating product stock:', error);
    throw error;
  }
};

module.exports = {
  listProducts,
  getProductById,
  updateProductStock
};
