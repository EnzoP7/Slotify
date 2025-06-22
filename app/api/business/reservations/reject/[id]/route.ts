import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { sendRejectedReservationEmail } from "@/lib/sendRejectedReservationEmail";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.cancelled }, // o "rejected" si tu modelo lo usa así
      include: {
        business: true,
      },
    });

    // 📨 Enviar email si hay datos válidos
    if (
      reservation.email &&
      reservation.name &&
      reservation.dateTime &&
      reservation.business?.name
    ) {
      await sendRejectedReservationEmail({
        to: reservation.email,
        customerName: reservation.name,
        dateTime: reservation.dateTime.toISOString(),
        businessName: reservation.business.name,
      });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error al rechazar la reserva:", error);
    return NextResponse.json(
      { error: "No se pudo rechazar la reserva" },
      { status: 500 }
    );
  }
}
