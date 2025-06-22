import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  blockedDates?: string | null; // ej: "2025-07-01,2025-12-25"
  blockedWeekdays?: string | null; // ej: "0,2,4" (Domingo, Martes, Jueves)
}

export default function ReservationCalendar({
  date,
  setDate,
  blockedDates,
  blockedWeekdays,
}: Props) {
  const safeBlockedDates = blockedDates ?? "";
  const safeBlockedWeekdays = blockedWeekdays ?? "";

  const blockedDateSet = new Set(
    safeBlockedDates
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean)
  );

  const blockedWeekdaySet = new Set(
    safeBlockedWeekdays
      .split(",")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 6)
  );

  return (
    <div className="flex flex-col items-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        locale={es}
        disabled={(currentDate) => {
          const today = startOfDay(new Date());
          const dateToCheck = startOfDay(currentDate);
          const formattedDate = format(dateToCheck, "yyyy-MM-dd");
          const dayOfWeek = dateToCheck.getDay();

          return (
            isBefore(dateToCheck, today) ||
            blockedDateSet.has(formattedDate) ||
            blockedWeekdaySet.has(dayOfWeek)
          );
        }}
      />
      {date && (
        <p className="mt-2 text-sm text-muted-foreground">
          Día seleccionado:{" "}
          <strong>{format(date, "PPP", { locale: es })}</strong>
        </p>
      )}
    </div>
  );
}
