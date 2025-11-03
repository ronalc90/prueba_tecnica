const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const dynamoDB = require('../config/dynamodb');
const logger = require('../config/logger');

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;

const createUser = async (email, password, name, address) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      address: address || '',
      createdAt: new Date().toISOString()
    };

    await dynamoDB.put({
      TableName: USERS_TABLE,
      Item: user
    }).promise();

    logger.info(`User created: ${email}`);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const result = await dynamoDB.query({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
  } catch (error) {
    logger.error('Error getting user by email:', error);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const result = await dynamoDB.get({
      TableName: USERS_TABLE,
      Key: { id: userId }
    }).promise();

    return result.Item || null;
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    throw error;
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword
};
