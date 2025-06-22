import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const slug = params.slug;

  console.log("QUE SLOG ENCONTRO: ", slug);

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 }
    );
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      businessId: business.id,
      status: "pending", // 🔑 Todas las pendientes, sin filtrar por fecha
    },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json(reservations);
}
