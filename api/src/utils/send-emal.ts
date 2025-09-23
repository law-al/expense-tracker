import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../../secret.js';

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: '"Lawal A" <lawahm303@gmail.com>',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
