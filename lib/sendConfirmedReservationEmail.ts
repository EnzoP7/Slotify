import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmedReservationEmail({
  to,
  customerName,
  dateTime,
  businessName,
}: {
  to: string;
  customerName: string;
  dateTime: string;
  businessName: string;
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
    from: "Reservas <onboarding@resend.dev>", // Usa tu dominio real si está verificado
    to,
    subject: `✅ Reserva confirmada en ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32;">🎉 Reserva Confirmada</h2>
        <p>Hola <strong>${customerName}</strong>,</p>
        <p>Tu reserva en <strong>${businessName}</strong> ha sido <strong>confirmada</strong>.</p>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Negocio:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${businessName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Fecha y hora:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Gracias por reservar con nosotros. ¡Te esperamos!</p>
        <p style="color: #888; font-size: 0.9em;">Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      </div>
    `,
  });
}
