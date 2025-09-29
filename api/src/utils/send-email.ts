import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../secret.js';

export const sendEmail = async (to: string, subject: string, html: string) => {
  // --- RECOMMENDED CONFIGURATION ---
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
