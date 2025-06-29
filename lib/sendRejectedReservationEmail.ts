import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRejectedReservationEmail({
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
    from: "Reservas <notificaciones@slotify.shop>",
    to,
    subject: `❌ Reserva rechazada por ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #c62828;">⚠️ Reserva Rechazada</h2>
        <p>Hola <strong>${customerName}</strong>,</p>
        <p>Lamentamos informarte que tu reserva en <strong>${businessName}</strong> para el día <strong>${formattedDate}</strong> no pudo ser confirmada en esta ocasión.</p>
        <p>Si lo deseás, podés intentar realizar otra reserva en una fecha diferente.</p>
        <p style="margin-top: 20px;">Gracias por tu interés.</p>
        <p style="color: #888; font-size: 0.9em;">Este correo fue generado automáticamente. No respondas a este mensaje.</p>
      </div>
    `,
  });
}
