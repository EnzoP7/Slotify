// app/api/admin/create-business/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Middleware para validar si es el admin (puede expandirse más adelante)
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const adminToken = process.env.CLAVE_ADMINISTRADOR; // lo guardás en tu .env
  return authHeader === `Bearer ${adminToken}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    slug,
    email,
    phone,
    password,
    slotDuration,
    openTime,
    closeTime,
    blockedDates,
  } = body;

  if (
    !name ||
    !slug ||
    !email ||
    !phone ||
    !password ||
    !slotDuration ||
    !openTime ||
    !closeTime
  ) {
    return NextResponse.json(
      { message: "Faltan datos obligatorios" },
      { status: 400 }
    );
  }

  const exists = await prisma.business.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json(
      { message: "Ya existe un negocio con ese slug" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const business = await prisma.business.create({
    data: {
      name,
      slug,
      email,
      phone,
      passwordHash: hashedPassword,
      slotDuration,
      openTime,
      closeTime,
      blockedDates: blockedDates || "",
    },
  });

  return NextResponse.json({
    message: "Negocio creado correctamente",
    business,
  });
}
