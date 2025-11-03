const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter;

const initializeEmailTransporter = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    logger.info(`Email transporter initialized with test account: ${testAccount.user}`);
    logger.info(`Password: ${testAccount.pass}`);
    logger.info(`Preview emails at: https://ethereal.email/login`);

    return transporter;
  } catch (error) {
    logger.error('Error initializing email transporter:', error);
    throw error;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!transporter) {
      await initializeEmailTransporter();
    }

    const info = await transporter.sendMail({
      from: '"Sports Shop" <noreply@sportsshop.com>',
      to,
      subject,
      html
    });

    logger.info(`Email sent: ${info.messageId}`);
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return {
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  initializeEmailTransporter,
  sendEmail
};
