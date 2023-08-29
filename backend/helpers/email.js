import nodemailer from 'nodemailer';
import { payOrderEmailTemplate } from '../utils/utils.js';

export const registerEmail = async (data) => {
  const { name, email, token } = data;

  //TODO: Send email move to env variables
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'c0cf2257249d4d',
      pass: '846f9902338dbc',
    },
  });
  // Mail information
  const info = await transport.sendMail({
    from: '"Amazona Ecommerce" <account@amazona.com>',
    to: `${name} <${email}>`,
    subject: 'Amazona - Confirm your account',
    text: `Check your acount`,
    html: `<p>Hello ${name}, please confirm your account by clicking the link below</p>
    <p><a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm your account</a></p>`,
  });
};
export const forgotPasswordEmail = async (data) => {
  const { name, email, token } = data;

  //TODO: Send email move to env variables
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'c0cf2257249d4d',
      pass: '846f9902338dbc',
    },
  });
  // Mail information
  const info = await transport.sendMail({
    from: '"Amazona Ecommerce" <account@amazona.com>',
    to: `${name} <${email}>`,
    subject: 'Amazona - Change your password',
    text: `Change your password`,
    html: `<p>Hello ${name}, you have request to change your password</p>
    <p><a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Change Password</a></p>`,
  });
};

export const orderEmail = async (data) => {
  const { name, email, order } = data;
  

  //TODO: Send email move to env variables
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'c0cf2257249d4d',
      pass: '846f9902338dbc',
    },
  });
  // Mail information
  const info = await transport.sendMail({
    from: '"Amazona Ecommerce" <account@amazona.com>',
    to: `${name} <${email}>`,
    subject: `Amazona - Order ${order._id}`,
    text: `Order ${order._id}`,
    html: payOrderEmailTemplate(order),
  });
};
