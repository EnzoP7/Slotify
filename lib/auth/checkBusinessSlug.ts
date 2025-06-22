import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function checkBusinessAccess(slugParam: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      businessId: string;
    };

    const business = await prisma.business.findUnique({
      where: { id: decoded.businessId },
    });

    if (!business || business.slug !== slugParam) {
      redirect("/unauthorized");
    }

    return business; // devolvemos el negocio si todo está bien
  } catch {
    redirect("/login");
  }
}
