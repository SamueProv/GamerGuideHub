import { MailService } from '@sendgrid/mail';

// Initialize SendGrid
const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send an email using SendGrid
 * @param params Email parameters (to, subject, text/html)
 * @returns Boolean indicating success or failure
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not found');
      return false;
    }

    await mailService.send({
      to: params.to,
      from: 'gametube@example.com', // Should be verified in SendGrid
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

/**
 * Send code updates via email
 * @param email Recipient email address
 * @param updates Code updates to send
 * @returns Boolean indicating success or failure
 */
export async function sendCodeUpdates(email: string, updates: string): Promise<boolean> {
  const subject = 'GameTube Code Updates';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ff0000; text-align: center;">GameTube Code Updates</h1>
      <p>Here are your latest code updates:</p>
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre;">
        ${updates.replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top: 20px; text-align: center; color: #777;">
        This is an automated message from GameTube.
      </p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html,
  });
}