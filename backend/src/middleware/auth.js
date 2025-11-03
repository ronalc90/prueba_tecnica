const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    return null;
  }
};

const authMiddleware = (handler) => {
  return async (event, context) => {
    try {
      const token = event.headers.Authorization || event.headers.authorization;

      if (!token) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            success: false,
            error: { message: 'No authorization token provided' }
          })
        };
      }

      const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = verifyToken(tokenValue);

      if (!decoded) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            success: false,
            error: { message: 'Invalid or expired token' }
          })
        };
      }

      event.user = decoded;
      logger.info(`User authenticated: ${decoded.email}`);

      return await handler(event, context);
    } catch (error) {
      logger.error('Auth middleware error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: { message: 'Internal server error' }
        })
      };
    }
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware
};
