import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { sendReservationCanceledEmail } from "@/lib/sendReservationCanceledEmail";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.cancelled },
      include: {
        business: true, // 👈 esto es lo que falta
      },
    });

    // Lógica de envío de correo
    if (
      reservation.email &&
      reservation.name &&
      reservation.dateTime &&
      reservation.business?.name
    ) {
      await sendReservationCanceledEmail({
        to: reservation.email,
        customerName: reservation.name,
        dateTime: reservation.dateTime.toISOString(),
        businessName: reservation.business?.name,
      });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error al marcar la reserva como pendiente:", error);
    return NextResponse.json(
      { error: "No se pudo cambiar el estado a pendiente" },
      { status: 500 }
    );
  }
}
