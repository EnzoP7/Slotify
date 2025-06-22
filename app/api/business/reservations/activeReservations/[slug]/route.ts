import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Falta la fecha" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 }
    );
  }

  const dayStart = startOfDay(new Date(date));
  const dayEnd = endOfDay(new Date(date));

  const reservations = await prisma.reservation.findMany({
    where: {
      businessId: business.id,
      status: "confirmed", // 🔑 Filtramos solo confirmadas
      dateTime: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json(reservations);
}
