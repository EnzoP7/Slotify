import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    console.log("Que slug llega: ", slug);

    if (!slug) {
      return NextResponse.json({ error: "Slug faltante" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        blockedWeekdays: true,
        blockedDates: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const validDates = (business.blockedDates || "")
      .split(",")
      .filter((d) => d >= today);

    // Si hay fechas pasadas que se deben borrar
    if (validDates.join(",") !== (business.blockedDates || "")) {
      await prisma.business.update({
        where: { slug },
        data: {
          blockedDates: validDates.length > 0 ? validDates.join(",") : null,
        },
      });
    }

    return NextResponse.json({
      blockedWeekdays: business.blockedWeekdays || "",
      blockedDates: validDates,
    });
  } catch (error) {
    console.error("❌ Error al obtener días no laborables:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
