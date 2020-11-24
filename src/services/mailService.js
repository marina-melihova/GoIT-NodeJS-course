const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `http://localhost:3000/api/v1/auth/verify/${verificationToken}`;
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Confirm your registration on Contacts-app',
    html: `<p>Welcome to Contacts-application!</p><a href=${verificationLink} target="_blank">Click here to verify your email</a>`,
  };
  await sgMail.send(msg);
};

module.exports = { sendVerificationEmail };
