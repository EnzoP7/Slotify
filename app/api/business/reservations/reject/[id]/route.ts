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
      data: { status: ReservationStatus.cancelled }, // o "rejected" si tu modelo lo usa así
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error al rechazar la reserva:", error);
    return NextResponse.json(
      { error: "No se pudo rechazar la reserva" },
      { status: 500 }
    );
  }
}
