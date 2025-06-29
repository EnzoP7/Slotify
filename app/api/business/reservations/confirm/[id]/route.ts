import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { sendConfirmedReservationEmail } from "@/lib/sendConfirmedReservationEmail";

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const id = pathname.split("/").pop(); // Obtener el ID de la URL

  console.log("[REQUEST] Ruta:", pathname);
  console.log("[REQUEST] ID recibido:", id);

  if (!id) {
    console.warn("[ERROR] No se proporcionó ID en la URL.");
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  try {
    console.log("[INFO] Buscando y actualizando reserva en la base de datos…");

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.confirmed },
      include: {
        business: true,
      },
    });

    console.log("[SUCCESS] Reserva actualizada:");
    console.log(reservation);

    if (
      reservation.email &&
      reservation.name &&
      reservation.dateTime &&
      reservation.business?.name
    ) {
      const emailData = {
        to: reservation.email,
        customerName: reservation.name,
        dateTime: reservation.dateTime.toISOString(),
        businessName: reservation.business.name,
      };

      console.log("[INFO] Enviando email de confirmación con estos datos:");
      console.log(emailData);

      await sendConfirmedReservationEmail(emailData);

      console.log("[SUCCESS] Email de confirmación enviado.");
    } else {
      console.warn(
        "[WARNING] Datos incompletos para enviar email. Skipping email."
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[ERROR] Fallo al confirmar reserva:");
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo confirmar la reserva" },
      { status: 500 }
    );
  }
}
