import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

function adjustToUtc(date: Date): Date {
  // Uruguay está en UTC-3, sumamos 3 horas para compensar
  return new Date(date.getTime() + 3 * 60 * 60 * 1000);
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
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

  // const dayStart = startOfDay(new Date(date));
  // const dayEnd = endOfDay(new Date(date));

  const localDate = new Date(date + "T00:00:00"); // evita desfases UTC
  const dayStart = adjustToUtc(startOfDay(localDate));
  const dayEnd = adjustToUtc(endOfDay(localDate));

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
