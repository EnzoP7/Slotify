import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.pending },
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
