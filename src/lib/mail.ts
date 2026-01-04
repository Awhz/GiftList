import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReservationEmailProps {
    to: string;
    giftName: string;
    giverName: string;
    listTitle: string;
    listUrl: string;
}

export async function sendReservationEmail({
    to,
    giftName,
    giverName,
    listTitle,
    listUrl,
}: SendReservationEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email.");
        return;
    }

    try {
        await resend.emails.send({
            from: "Liste Cadeau <onboarding@resend.dev>", // Using default Resend domain for testing
            to: to,
            subject: `🎁 Nouveau cadeau réservé : ${giftName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #be123c;">Un cadeau a été réservé !</h2>
          <p>Bonjour,</p>
          <p>Bonne nouvelle ! <strong>${giverName}</strong> vient de réserver ou de participer au cadeau <strong>"${giftName}"</strong> sur votre liste "${listTitle}".</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">${giftName}</p>
            <p style="margin: 5px 0 0 0; color: #4b5563;">Réservé par : ${giverName}</p>
          </div>
          <p>
            <a href="${listUrl}" style="background-color: #be123c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Voir ma liste
            </a>
          </p>
        </div>
      `,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}
