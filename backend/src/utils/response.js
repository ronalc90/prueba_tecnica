const logger = require('../config/logger');

const success = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      success: true,
      data
    })
  };
};

const error = (message, statusCode = 400, details = null) => {
  logger.error(`Error response: ${message}`, { statusCode, details });

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      success: false,
      error: {
        message,
        ...(details && { details })
      }
    })
  };
};

module.exports = {
  success,
  error
};
