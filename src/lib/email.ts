import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
    to: string;
    name: string;
    language: 'fr' | 'en';
    contactInfo?: string;
}

export async function sendLeadNotificationEmail(options: EmailOptions) {
    const { to, name, language, contactInfo } = options;

    const isFrench = language === 'fr';

    const subject = isFrench
        ? `Nouveau lead reçu - ${name}`
        : `New lead received - ${name}`;

    const htmlContent = isFrench
        ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Nouveau lead reçu</h2>
        <p style="color: #666; font-size: 16px;">Un nouveau contact a rempli votre formulaire.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Contact:</strong> ${contactInfo || 'Non fourni'}</p>
        </div>
        
        <p style="color: #999; font-size: 14px;">Envoyé depuis votre formulaire Smart vCard</p>
      </div>
    `
        : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">New Lead Received</h2>
        <p style="color: #666; font-size: 16px;">A new contact has submitted your form.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Contact:</strong> ${contactInfo || 'Not provided'}</p>
        </div>
        
        <p style="color: #999; font-size: 14px;">Sent from your Smart vCard form</p>
      </div>
    `;

    try {
        const response = await resend.emails.send({
            from: 'noreply@resend.dev',
            to,
            subject,
            html: htmlContent,
        });

        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function sendLeadConfirmationEmail(options: EmailOptions) {
    const { to, name, language } = options;

    const isFrench = language === 'fr';

    const subject = isFrench
        ? 'Merci de votre contact'
        : 'Thank you for contacting us';

    const htmlContent = isFrench
        ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Merci ${name} !</h2>
        <p style="color: #666; font-size: 16px;">Nous avons bien reçu vos informations de contact.</p>
        <p style="color: #666; font-size: 16px;">Nous vous recontacterons très bientôt.</p>
        
        <div style="margin-top: 30px; color: #999; font-size: 14px;">
          <p>À bientôt,</p>
          <p>L'équipe Smart vCard</p>
        </div>
      </div>
    `
        : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Thank you ${name}!</h2>
        <p style="color: #666; font-size: 16px;">We have received your contact information.</p>
        <p style="color: #666; font-size: 16px;">We will get back to you soon.</p>
        
        <div style="margin-top: 30px; color: #999; font-size: 14px;">
          <p>Best regards,</p>
          <p>The Smart vCard Team</p>
        </div>
      </div>
    `;

    try {
        const response = await resend.emails.send({
            from: 'noreply@resend.dev',
            to,
            subject,
            html: htmlContent,
        });

        console.log('Confirmation email sent:', response);
        return response;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
}
