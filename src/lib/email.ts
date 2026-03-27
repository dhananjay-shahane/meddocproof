/**
 * Email utility for MedDocProof
 * Configure with environment variables:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USER
 * - SMTP_PASS
 * - SUPPORT_EMAIL (sender email)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Escape HTML special characters to prevent XSS in email templates
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Check if email is configured
export function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SUPPORT_EMAIL
  );
}

/**
 * Send an email
 * Uses native fetch to call an SMTP-to-HTTP service or direct SMTP
 * For production, consider using Resend, SendGrid, or similar services
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.log("[Email] Not configured, skipping email to:", options.to);
    console.log("[Email] Subject:", options.subject);
    return { success: true }; // Return success to not block the flow
  }

  try {
    // For now, we'll use a simple HTTP-based email API
    // You can replace this with nodemailer, Resend, SendGrid, etc.
    const supportEmail = process.env.SUPPORT_EMAIL;
    
    // Log the email that would be sent
    console.log("[Email] Sending email from:", supportEmail);
    console.log("[Email] To:", options.to);
    console.log("[Email] Subject:", options.subject);
    
    // TODO: Implement actual email sending with your preferred service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: supportEmail, to: options.to, subject: options.subject, html: options.html });
    
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return { success: false, error: String(error) };
  }
}

// Email templates
export const emailTemplates = {
  doctorRegistrationConfirmation: (doctorName: string, email: string) => ({
    subject: "Registration Received - MedDocProof",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #1e3a5f; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .highlight { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0; }
          h1 { margin: 0; font-size: 24px; }
          .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Received</h1>
          </div>
          <div class="content">
            <p>Dear Dr. ${escapeHtml(doctorName)},</p>
            <p>Thank you for registering with <strong>MedDocProof</strong>. We have received your application and our admin team is reviewing your credentials.</p>
            
            <div class="highlight">
              <strong>What happens next?</strong>
              <ul>
                <li>Our team will verify your medical registration and documents</li>
                <li>This process typically takes 1-2 business days</li>
                <li>You will receive an email notification once your account is approved</li>
              </ul>
            </div>
            
            <p><strong>Your registered email:</strong> ${escapeHtml(email)}</p>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The MedDocProof Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MedDocProof. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear Dr. ${doctorName},

Thank you for registering with MedDocProof. We have received your application and our admin team is reviewing your credentials.

What happens next?
- Our team will verify your medical registration and documents
- This process typically takes 1-2 business days
- You will receive an email notification once your account is approved

Your registered email: ${email}

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The MedDocProof Team
    `.trim(),
  }),

  doctorApproved: (doctorName: string, loginUrl: string) => ({
    subject: "Account Approved - Welcome to MedDocProof!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #1e3a5f; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          h1 { margin: 0; font-size: 24px; }
          .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Approved!</h1>
          </div>
          <div class="content">
            <p>Dear Dr. ${escapeHtml(doctorName)},</p>
            <p>Great news! Your MedDocProof account has been <strong>approved</strong>.</p>
            <p>You can now log in to your doctor portal and start accepting certificate requests from patients.</p>
            <a href="${escapeHtml(loginUrl)}" class="btn">Login to Your Account</a>
            <p style="margin-top: 20px;">If you have any questions, our support team is here to help.</p>
            <p>Welcome aboard!</p>
            <p>Best regards,<br>The MedDocProof Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MedDocProof. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear Dr. ${doctorName},

Great news! Your MedDocProof account has been approved.

You can now log in to your doctor portal and start accepting certificate requests from patients.

Login here: ${loginUrl}

If you have any questions, our support team is here to help.

Welcome aboard!

Best regards,
The MedDocProof Team
    `.trim(),
  }),

  doctorRejected: (doctorName: string, reason?: string) => ({
    subject: "Registration Update - MedDocProof",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #1e3a5f; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          h1 { margin: 0; font-size: 24px; }
          .reason { background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Update</h1>
          </div>
          <div class="content">
            <p>Dear Dr. ${escapeHtml(doctorName)},</p>
            <p>We regret to inform you that your registration with MedDocProof could not be approved at this time.</p>
            ${reason ? `<div class="reason"><strong>Reason:</strong> ${escapeHtml(reason)}</div>` : ""}
            <p>If you believe this is an error or would like to provide additional documentation, please contact our support team.</p>
            <p>Best regards,<br>The MedDocProof Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MedDocProof. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear Dr. ${doctorName},

We regret to inform you that your registration with MedDocProof could not be approved at this time.

${reason ? `Reason: ${reason}` : ""}

If you believe this is an error or would like to provide additional documentation, please contact our support team.

Best regards,
The MedDocProof Team
    `.trim(),
  }),
};
