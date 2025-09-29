import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../secret.js';

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log('EMAIL_USER:', EMAIL_USER);
  console.log('EMAIL_PASSWORD:', EMAIL_PASSWORD ? '********' : 'Not Set');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Lawal A" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
