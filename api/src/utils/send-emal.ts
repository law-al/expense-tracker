import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../secret.js';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.error('Email credentials not configured');
      throw new Error('Email service not configured');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },

      pool: true,
      maxConnections: 1,
      maxMessages: 3,
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Expense Tracker" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return info;
  } catch (error: unknown) {
    console.error('Email sending failed:', error);

    return false;
  }
};
