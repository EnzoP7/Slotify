/**
 * Convierte un string de fecha-hora (por ejemplo "2025-06-21T15:30")
 * en una instancia de Date interpretada en hora local (sin aplicar UTC).
 *
 * ⚠️ Asegura que se preserve la hora que el usuario eligió en su zona horaria.
 *
 * @param dateTimeString - Ejemplo: "2025-06-21T15:30" o "2025-06-21T15:30:00Z"
 * @returns Date local con hora exacta
 */
export function parseDateTimeLocal(dateTimeString: string): Date {
  console.log("🔹 Fecha original recibida:", dateTimeString);

  let original = dateTimeString;

  // Remueve el sufijo 'Z' (UTC) si lo tiene
  if (original.endsWith("Z")) {
    original = original.slice(0, -1);
    console.log("✂️ Removido 'Z':", original);
  }

  // Elimina cualquier offset tipo -03:00 para evitar que JS lo procese como UTC
  const cleaned = original.replace(/[+-]\d\d:\d\d$/, "");
  console.log("🧼 Limpiado offset (si tenía):", cleaned);

  const [datePart, timePart = "00:00"] = cleaned.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute = 0] = timePart.split(":").map(Number);

  console.log("📆 Partes de la fecha:", { year, month, day });
  console.log("⏰ Partes de la hora:", { hour, minute });

  const localDate = new Date(year, month - 1, day, hour, minute);

  console.log("📅 Fecha generada (local):", localDate.toString());

  return localDate;
}
