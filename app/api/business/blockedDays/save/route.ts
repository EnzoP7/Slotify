import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug, blockedWeekdays, blockedDates } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug faltante" }, { status: 400 });
    }

    await prisma.business.update({
      where: { slug },
      data: {
        blockedWeekdays: blockedWeekdays || null,
        blockedDates: blockedDates || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error al guardar días no laborables:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
