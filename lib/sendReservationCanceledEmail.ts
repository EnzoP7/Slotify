import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReservationCanceledEmail({
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
    from: "Reservas <onboarding@resend.dev>",
    to,
    subject: `❌ Cancelación de tu reserva en ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">❌ Tu reserva ha sido cancelada</h2>
        <p>Hola <strong>${customerName}</strong>,</p>
        <p>Lamentamos informarte que tu reserva para el negocio <strong>${businessName}</strong> ha sido cancelada.</p>
        <p><strong>Fecha y hora de la reserva:</strong> ${formattedDate}</p>
        <p>Si tenés dudas, comunicate directamente con el negocio.</p>
        <p style="color: #888; font-size: 0.9em;">Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      </div>
    `,
  });
}
