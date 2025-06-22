// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

declare global {
  // Permite usar una sola instancia en desarrollo (evita crear múltiples clientes)
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // opcional: muestra logs en consola
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
