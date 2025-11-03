const { checkoutSchema } = require('../models/schemas');
const { getCart, clearCart } = require('../services/cartService');
const { updateProductStock } = require('../services/productService');
const { createOrder } = require('../services/orderService');
const { sendEmail } = require('../config/email');
const { authMiddleware } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const logger = require('../config/logger');

const process = authMiddleware(async (event) => {
  try {
    const userId = event.user.userId;
    const userEmail = event.user.email;
    const body = JSON.parse(event.body);

    const { error: validationError } = checkoutSchema.validate(body);
    if (validationError) {
      return error(validationError.details[0].message, 400);
    }

    const { shippingAddress, paymentMethod } = body;

    const cart = await getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      return error('Cart is empty', 400);
    }

    for (const item of cart.items) {
      try {
        await updateProductStock(item.productId, item.quantity);
      } catch (err) {
        logger.error(`Stock validation failed for product ${item.productId}:`, err);
        return error(`Insufficient stock for product: ${item.name}`, 400);
      }
    }

    const order = await createOrder(
      userId,
      userEmail,
      cart.items,
      cart.total,
      shippingAddress,
      paymentMethod
    );

    await clearCart(userId);

    let emailPreview = null;
    try {
      const emailHtml = generateOrderEmailHtml(order);
      const emailResult = await Promise.race([
        sendEmail(userEmail, `Order Confirmation - ${order.id}`, emailHtml),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 3000))
      ]);
      emailPreview = emailResult.previewUrl;
      logger.info(`Order completed: ${order.id}, Email preview: ${emailPreview}`);
    } catch (emailError) {
      logger.warn(`Email sending failed for order ${order.id}:`, emailError.message);
    }

    return success({
      order,
      message: 'Order completed successfully',
      ...(emailPreview && { emailPreview })
    });
  } catch (err) {
    logger.error('Checkout error:', err);
    return error(err.message || 'Checkout failed', 500);
  }
});

const generateOrderEmailHtml = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .order-info { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; background-color: white; }
        th { background-color: #f3f4f6; padding: 10px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Thank you for your order!</p>
          <div class="order-info">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
          <h2>Order Details</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total">
            Total: $${order.total.toFixed(2)}
          </div>
          <p style="margin-top: 30px; color: #666;">
            If you have any questions about your order, please contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  process
};
