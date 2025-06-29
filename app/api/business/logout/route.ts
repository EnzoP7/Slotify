import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Eliminar la cookie de sesión
  (
    await // Eliminar la cookie de sesión
    cookies()
  ).delete("session");

  return NextResponse.json(
    { message: "Sesión cerrada exitosamente." },
    { status: 200 }
  );
}
