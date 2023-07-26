import nodemailer from 'nodemailer';

export const registerEmail = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '2400f35586cd3b',
      pass: '56857d29985e58',
    },
  });
  // Mail information
   const info = await transport.sendMail({
    from: '"Ecommerce" <account@amazona.com>',
    to: `${name} <${email}>`,
    subject: 'Amazona - Confirm your account',
    text: `Check your acount`,
    html: `<p>Hello ${name}, please confirm your account by clicking the link below</p>
    <p><a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm your account</a></p>`,
   });
};


