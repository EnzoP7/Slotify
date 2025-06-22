import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { sendConfirmedReservationEmail } from "@/lib/sendConfirmedReservationEmail";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.confirmed },
      include: {
        business: true, // 👈 para poder acceder a business.name
      },
    });

    // ✅ Lógica de envío de correo
    if (
      reservation.email &&
      reservation.name &&
      reservation.dateTime &&
      reservation.business?.name
    ) {
      await sendConfirmedReservationEmail({
        to: reservation.email,
        customerName: reservation.name,
        dateTime: reservation.dateTime.toISOString(),
        businessName: reservation.business.name,
      });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error al confirmar la reserva:", error);
    return NextResponse.json(
      { error: "No se pudo confirmar la reserva" },
      { status: 500 }
    );
  }
}
