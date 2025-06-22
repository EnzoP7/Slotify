import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.cancelled },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error al marcar la reserva como pendiente:", error);
    return NextResponse.json(
      { error: "No se pudo cambiar el estado a pendiente" },
      { status: 500 }
    );
  }
}
