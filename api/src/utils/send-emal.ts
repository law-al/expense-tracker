import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../secret.js';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    // add gmail
    service: 'gmail',
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
    html,
  };

  await transporter.sendMail(mailOptions);
};
