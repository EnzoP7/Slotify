import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDateTimeLocal } from "@/lib/parseDateTimeLocal";
import { ReservationStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    console.log("📨 Iniciando creación de reserva...");

    const body = await req.json();
    console.log("📥 Body recibido:", JSON.stringify(body, null, 2));

    const { name, lastName, email, phone, dateTime, businessId } = body;

    // Validaciones iniciales
    if (!businessId || !name || !email || !phone || !dateTime) {
      console.warn("⚠️ Faltan campos obligatorios");
      return NextResponse.json(
        { message: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // const requestedDate = new Date(dateTime);
    const requestedDate = parseDateTimeLocal(dateTime);
    console.log("QUE FEHCA FINAL NOS TRAE: ", requestedDate);

    if (isNaN(requestedDate.getTime())) {
      console.error("❌ Fecha inválida:", dateTime);
      return NextResponse.json({ message: "Fecha inválida" }, { status: 400 });
    }

    // console.log("📅 Fecha convertida:", requestedDate.toISOString());

    // Buscar negocio
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      console.error("❌ Negocio no encontrado:", businessId);
      return NextResponse.json(
        { message: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    console.log("🏪 Negocio encontrado:", business.name);

    // Verificar fechas bloqueadas
    const blocked = business.blockedDates
      ?.split(",")
      .map((d) => d.trim())
      .includes(requestedDate.toISOString().split("T")[0]);

    if (blocked) {
      console.warn(
        "🚫 Fecha bloqueada:",
        requestedDate.toISOString().split("T")[0]
      );
      return NextResponse.json(
        { message: "Fecha no disponible" },
        { status: 400 }
      );
    }

    // Verificar horario
    const [openHour, openMin] = business.openTime.split(":").map(Number);
    const [closeHour, closeMin] = business.closeTime.split(":").map(Number);
    const hourOnly = requestedDate.getHours() + requestedDate.getMinutes() / 60;
    const opening = openHour + openMin / 60;
    const closing = closeHour + closeMin / 60;

    console.log(
      `🕓 Horario solicitado: ${hourOnly} | Rango permitido: ${opening} - ${closing}`
    );

    if (hourOnly < opening || hourOnly >= closing + 1) {
      console.warn("⛔ Horario fuera de rango");
      return NextResponse.json(
        { message: "Horario fuera del rango" },
        { status: 400 }
      );
    }

    // Verificar solapamiento
    const overlap = await prisma.reservation.findFirst({
      where: {
        businessId,
        dateTime: requestedDate,
        status: {
          in: [ReservationStatus.confirmed, ReservationStatus.pending],
        },
      },
    });

    if (overlap) {
      console.warn("📛 Ya existe una reserva para esa fecha/hora.");
      return NextResponse.json(
        { message: "Horario no disponible" },
        { status: 400 }
      );
    }

    const dataTotal = {
      dateTime: requestedDate,
      status: ReservationStatus.pending,
      name,
      lastName: lastName || "",
      email,
      phone,
      business: {
        connect: {
          id: businessId,
        },
      },
    };

    const reservation = await prisma.reservation.create({
      data: dataTotal,
      include: {
        business: true,
      },
    });

    console.log("✅ Reserva creada exitosamente:", reservation.id);

    return NextResponse.json({ message: "Reserva creada", reservation });
  } catch (error) {
    console.error("❌ Error del servidor:", error);
    return NextResponse.json(
      { message: "Error del servidor", error: String(error) },
      { status: 500 }
    );
  }
}
