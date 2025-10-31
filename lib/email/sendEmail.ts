import * as nodemailer from 'nodemailer';
import * as sgMail from '@sendgrid/mail';
import { Resend } from 'resend';

// Initialize providers
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (data: EmailData) => {
  const provider = process.env.EMAIL_PROVIDER || 'smtp';

  switch (provider) {
    case 'smtp':
      if (!process.env.SMTP_HOST) {
        throw new Error('SMTP host not configured');
      }
      {
        const emailDefaults = {
          from: process.env.SMTP_FROM,
        };
        await smtpTransporter.sendMail({ ...emailDefaults, ...data });
      }
      break;

    case 'sendgrid':
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key not configured');
      }
      await sgMail.send({
        to: data.to,
        from: process.env.SMTP_FROM || 'noreply@example.com', // Use SMTP_FROM or default
        subject: data.subject,
        html: data.html,
        text: data.text,
      });
      break;

    case 'resend':
      if (!process.env.RESEND_API_KEY || !resend) {
        throw new Error('Resend API key not configured');
      }
      {
        const { data: resendData, error } = await resend.emails.send({
          from: process.env.SMTP_FROM || 'onboarding@resend.dev',
          to: [data.to],
          subject: data.subject,
          html: data.html,
          text: data.text,
        });

        if (error) {
          throw new Error(`Resend error: ${error.message}`);
        }

        console.log('Resend email sent successfully:', resendData);
      }
      break;

    default:
      throw new Error(`Unsupported email provider: ${provider}`);
  }
};
