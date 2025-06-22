import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, format } from "date-fns";
import { ReservationStatus } from "@prisma/client"; // Asegurate de esto

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug no proporcionado" },
        { status: 400 }
      );
    }

    const { date } = await req.json();

    if (!date) {
      return NextResponse.json(
        { message: "Fecha no proporcionada" },
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

    const isBlocked = business.blockedDates
      ?.split(",")
      .map((d) => d.trim())
      .includes(date);

    if (isBlocked) {
      return NextResponse.json({ message: "Fecha bloqueada" }, { status: 400 });
    }

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59.999`);

    const reservations = await prisma.reservation.findMany({
      where: {
        businessId: business.id,
        status: {
          in: [ReservationStatus.confirmed, ReservationStatus.pending],
        },
        dateTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    const durationMinutes = business.slotDuration ?? 30;

    const openDate = new Date(`${date}T${business.openTime}:00`);
    const closeDate = new Date(`${date}T${business.closeTime}:00`);

    const availableSlots: string[] = [];
    let slot = new Date(openDate);

    while (slot <= closeDate) {
      const overlapping = reservations.some(
        (r) => r.dateTime.getTime() === slot.getTime()
      );

      if (!overlapping) {
        availableSlots.push(format(slot, "HH:mm"));
      }

      slot = addMinutes(slot, durationMinutes);
    }
    console.log("LOS AVAILABLE SLOTS: ", availableSlots);

    return NextResponse.json({ availableSlots });
  } catch (error) {
    return NextResponse.json(
      { message: "Error en el servidor", error: (error as Error).message },
      { status: 500 }
    );
  }
}
