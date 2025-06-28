// /api/business/schedule/save
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { slug, schedules } = await req.json();

    if (!slug || !schedules) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      return NextResponse.json(
        { message: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar todos los horarios anteriores para este negocio
    await prisma.businessSchedule.deleteMany({
      where: { businessId: business.id },
    });

    // Insertar los nuevos horarios
    await prisma.businessSchedule.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: schedules.map((s: any) => ({
        businessId: business.id,
        weekday: s.weekday,
        startTime: s.startTime,
        endTime: s.endTime,
        slotDuration: s.slotDuration, // nuevo campo para duración por bloque
      })),
    });

    return NextResponse.json({ message: "Horarios actualizados" });
  } catch (error) {
    console.error("Error al guardar horarios:", error);
    return NextResponse.json(
      { message: "Error en el servidor", error: (error as Error).message },
      { status: 500 }
    );
  }
}
