import { Resend } from 'resend';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartvcard.app';
const FROM = 'Smart vCard <noreply@smartvcard.app>';

// Instanciation lazy pour éviter l'erreur au chargement du module
// quand RESEND_API_KEY n'est pas encore injecté
function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  return new Resend(process.env.RESEND_API_KEY);
}

export interface LeadNotificationOptions {
  to: string;
  ownerName: string;
  cardSlug: string;
  lead: {
    name: string;
    email?: string;
    phone?: string;
    domain?: string;
    message?: string;
  };
}

export async function sendLeadNotificationEmail(opts: LeadNotificationOptions): Promise<void> {
  const { to, ownerName, cardSlug, lead } = opts;
  const cardUrl = `${APP_URL}/${cardSlug}`;
  const dashboardUrl = `${APP_URL}/dashboard/leads`;

  const rows = [
    { label: 'Nom', value: lead.name },
    lead.email ? { label: 'Email', value: lead.email } : null,
    lead.phone ? { label: 'Téléphone', value: lead.phone } : null,
    lead.domain ? { label: 'Secteur', value: lead.domain } : null,
    lead.message ? { label: 'Message', value: lead.message } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const rowsHtml = rows.map((r) => `
    <tr>
      <td style="padding:8px 0;color:#71717a;font-size:13px;width:100px;vertical-align:top">${r.label}</td>
      <td style="padding:8px 0;color:#f4f4f5;font-size:13px;vertical-align:top">${r.value}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#18181b;border-radius:16px;overflow:hidden;border:1px solid #27272a">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:28px 32px">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.7);text-transform:uppercase">Smart vCard</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff">🔔 Nouveau lead reçu</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px">
            <p style="margin:0 0 20px;font-size:14px;color:#a1a1aa">
              Bonjour <strong style="color:#f4f4f5">${ownerName}</strong>, quelqu'un vient de remplir votre formulaire sur
              <a href="${cardUrl}" style="color:#f97316;text-decoration:none">${cardUrl}</a>.
            </p>

            <div style="background:#09090b;border-radius:12px;border:1px solid #27272a;padding:20px 24px;margin-bottom:24px">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${rowsHtml}
              </table>
            </div>

            <a href="${dashboardUrl}"
              style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px">
              Voir mes leads →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid #27272a">
            <p style="margin:0;font-size:11px;color:#52525b;text-align:center">
              Smart vCard · <a href="${APP_URL}" style="color:#52525b">${APP_URL}</a><br>
              Vous recevez cet email car vous avez activé les notifications de leads.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `🔔 Nouveau lead — ${lead.name}`,
    html,
  });
}

export interface LeadConfirmationOptions {
  to: string;
  visitorName: string;
  ownerName: string;
  cardSlug: string;
  language?: 'fr' | 'en';
}

export async function sendLeadConfirmationEmail(opts: LeadConfirmationOptions): Promise<void> {
  const { to, visitorName, ownerName, cardSlug, language = 'fr' } = opts;
  const fr = language === 'fr';
  const cardUrl = `${APP_URL}/${cardSlug}`;

  const html = `<!DOCTYPE html>
<html lang="${language}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#18181b;border-radius:16px;overflow:hidden;border:1px solid #27272a">
        <tr>
          <td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:28px 32px">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff">
              ${fr ? `Merci ${visitorName} !` : `Thank you ${visitorName}!`}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px">
            <p style="margin:0 0 16px;font-size:14px;color:#a1a1aa">
              ${fr
                ? `Vos coordonnées ont bien été transmises à <strong style="color:#f4f4f5">${ownerName}</strong>. Vous serez recontacté très prochainement.`
                : `Your contact details have been sent to <strong style="color:#f4f4f5">${ownerName}</strong>. You'll hear back soon.`}
            </p>
            <a href="${cardUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px">
              ${fr ? 'Revoir la carte' : 'View the card'}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid #27272a">
            <p style="margin:0;font-size:11px;color:#52525b;text-align:center">Smart vCard · <a href="${APP_URL}" style="color:#52525b">${APP_URL}</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: fr ? `✅ Message bien reçu — ${ownerName}` : `✅ Message received — ${ownerName}`,
    html,
  });
}
