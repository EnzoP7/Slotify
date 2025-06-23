import { NextRequest, NextResponse } from "next/server";
import { sendReservationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { to, customerName, dateTime, businessName, slug } = body;

    if (![to, customerName, dateTime, businessName, slug].every(Boolean)) {
      console.warn("⚠️ Faltan campos obligatorios:", body);
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    console.log("✉️ Enviando email de reserva al negocio:");
    console.log(`📍 Destinatario: ${to}`);
    console.log(`👤 Cliente: ${customerName}`);
    console.log(`📅 Fecha/Hora: ${dateTime}`);
    console.log(`🏪 Negocio: ${businessName}`);

    const result = await sendReservationEmail({
      to,
      customerName,
      dateTime,
      businessName,
      slug,
    });

    console.log("✅ Email enviado correctamente");

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    return NextResponse.json(
      { message: "Error enviando email", error: (error as Error).message },
      { status: 500 }
    );
  }
}
