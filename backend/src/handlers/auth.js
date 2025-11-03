const { registerSchema, loginSchema } = require('../models/schemas');
const { createUser, getUserByEmail, verifyPassword } = require('../services/userService');
const { generateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const logger = require('../config/logger');

const register = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { error: validationError } = registerSchema.validate(body);
    if (validationError) {
      return error(validationError.details[0].message, 400);
    }

    const { email, password, name, address } = body;

    const user = await createUser(email, password, name, address);
    const token = generateToken(user.id, user.email);

    logger.info(`User registered: ${email}`);

    return success({
      user,
      token
    }, 201);
  } catch (err) {
    logger.error('Registration error:', err);
    return error(err.message || 'Registration failed', 400);
  }
};

const login = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { error: validationError } = loginSchema.validate(body);
    if (validationError) {
      return error(validationError.details[0].message, 400);
    }

    const { email, password } = body;

    const user = await getUserByEmail(email);
    if (!user) {
      return error('Invalid credentials', 401);
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return error('Invalid credentials', 401);
    }

    const token = generateToken(user.id, user.email);

    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${email}`);

    return success({
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    logger.error('Login error:', err);
    return error(err.message || 'Login failed', 400);
  }
};

module.exports = {
  register,
  login
};
