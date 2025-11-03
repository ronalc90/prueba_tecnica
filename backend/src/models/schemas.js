const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  address: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const checkoutSchema = Joi.object({
  shippingAddress: Joi.string().required(),
  paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal').required()
});

const productQuerySchema = Joi.object({
  category: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  addToCartSchema,
  checkoutSchema,
  productQuerySchema
};
