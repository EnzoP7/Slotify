// /app/api/business/hoursAvailable/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  console.log("QUE SLUG LLEGA: ", slug);

  try {
    if (!slug) {
      return NextResponse.json(
        { message: "Slug no proporcionado" },
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

    const schedules = await prisma.businessSchedule.findMany({
      where: { businessId: business.id },
      select: {
        weekday: true,
        startTime: true,
        endTime: true,
        slotDuration: true,
      },
    });

    return NextResponse.json({
      schedules,
    });
  } catch (error) {
    console.error("❌ Error al obtener horarios:", error);
    return NextResponse.json(
      { message: "Error interno", error: (error as Error).message },
      { status: 500 }
    );
  }
}
