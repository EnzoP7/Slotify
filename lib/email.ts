// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReservationEmail({
  to,
  customerName,
  dateTime,
  businessName,
  slug,
}: {
  to: string;
  customerName: string;
  dateTime: string;
  businessName: string;
  slug: string;
}) {
  const formattedDate = new Date(dateTime).toLocaleString("es-UY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return await resend.emails.send({
    from: "Reservas <notificaciones@slotify.shop>", // cambiar a dominio real si se verifica
    to,
    subject: `📥 Nueva solicitud de reserva para ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">📅 Nueva solicitud de reserva</h2>
        <p>Hola <strong>${businessName}</strong>,</p>
        <p>Has recibido una nueva solicitud de reserva desde tu sitio web.</p>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Cliente:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Fecha y hora:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
  Ingresá al <a href="http://localhost:3000/business/dashboard/${slug}" target="_blank">panel de administración</a> para aceptar o gestionar esta reserva.
</p>
        <p style="color: #888; font-size: 0.9em;">Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      </div>
    `,
  });
}
