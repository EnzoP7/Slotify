import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { email: email },
  });

  if (!business || !business.passwordHash) {
    return NextResponse.json(
      { message: "Negocio no encontrado" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, business.passwordHash);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { businessId: business.id, role: "business" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  const response = NextResponse.json({
    message: "Login exitoso",
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
    },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    path: "/",
    sameSite: "lax", // <- importante para evitar que se bloquee la cookie
    maxAge: 60 * 60,
  });

  return response;
}
