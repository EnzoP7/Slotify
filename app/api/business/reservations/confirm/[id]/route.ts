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
      data: { status: ReservationStatus.confirmed },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error al confirmar la reserva:", error);
    return NextResponse.json(
      { error: "No se pudo confirmar la reserva" },
      { status: 500 }
    );
  }
}
