import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, format } from "date-fns";
import { ReservationStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const slug = pathname.split("/").pop();

  console.log("[REQUEST] Pathname:", pathname);
  console.log("[REQUEST] Slug extraído:", slug);

  try {
    if (!slug) {
      console.warn("[ERROR] Slug no proporcionado");
      return NextResponse.json(
        { message: "Slug no proporcionado" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { date } = body;

    console.log("[REQUEST] Fecha recibida:", date);

    if (!date) {
      console.warn("[ERROR] Fecha no proporcionada");
      return NextResponse.json(
        { message: "Fecha no proporcionada" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      console.warn("[ERROR] Negocio no encontrado para slug:", slug);
      return NextResponse.json(
        { message: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    console.log("[INFO] Negocio encontrado:", business.name);

    const isBlocked = business.blockedDates
      ?.split(",")
      .map((d) => d.trim())
      .includes(date);

    if (isBlocked) {
      console.warn("[INFO] La fecha está bloqueada:", date);
      return NextResponse.json({ message: "Fecha bloqueada" }, { status: 400 });
    }

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59.999`);
    // const weekday = new Date(date).getDay();

    const jsDay = new Date(date).getDay(); // Domingo = 0, Lunes = 1, ..., Sábado = 6
    const weekday = jsDay === 0 ? 6 : jsDay + 1; // Reasigna Domingo como 6, y el resto corre -1

    console.log("[INFO] Día de la semana:", weekday);

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

    console.log("[INFO] Reservas encontradas:", reservations.length);

    const schedules = await prisma.businessSchedule.findMany({
      where: {
        businessId: business.id,
        weekday,
      },
    });

    console.log("[INFO] Bloques de horario para el día:", schedules.length);

    const reservedTimestamps = new Set(
      reservations.map((r) => r.dateTime.getTime())
    );

    const availableSlots: string[] = [];

    for (const schedule of schedules) {
      const slotDuration = schedule.slotDuration ?? 30;
      let current = new Date(`${date}T${schedule.startTime}:00`);
      const end = new Date(`${date}T${schedule.endTime}:00`);

      console.log(
        `[BLOQUE] ${schedule.startTime} - ${schedule.endTime} con duración ${slotDuration} min`
      );

      while (current < end) {
        const timestamp = current.getTime();
        const formatted = format(current, "HH:mm");

        if (!reservedTimestamps.has(timestamp)) {
          availableSlots.push(formatted);
          console.log(`--> Slot disponible: ${formatted}`);
        } else {
          console.log(`--X Slot ocupado: ${formatted}`);
        }

        current = addMinutes(current, slotDuration);
      }
    }

    console.log("[RESULTADO] Total slots disponibles:", availableSlots.length);

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("[ERROR] Excepción en servidor:", error);
    return NextResponse.json(
      { message: "Error en el servidor", error: (error as Error).message },
      { status: 500 }
    );
  }
}
