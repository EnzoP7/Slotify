"use client";

import MenuDialog from "@/src/components/MenuDialog";
import Beams from "@/src/UX/Bean";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BusinessBlockedDaysClient() {
  const params = useParams();
  const slug = params?.slug as string;

  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [specificDates, setSpecificDates] = useState<string[]>([]);
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");

  // ✅ Cargar datos desde el servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/business/blockedDays/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        const data = await res.json();
        if (data?.blockedWeekdays) {
          setSelectedWeekdays(
            data.blockedWeekdays
              .split(",")
              .map((n: string) => weekdayFromNumber(Number(n)))
          );
        }

        if (data?.blockedDates) {
          setSpecificDates(data.blockedDates);
        }
      } catch (error) {
        console.error("Error al cargar días no laborables:", error);
      }
    };

    fetchData();
  }, [slug]);

  // ✅ Guardar en el servidor
  const handleSave = async () => {
    const weekdaysAsNumbers = selectedWeekdays
      .map((d) => weekdayToNumber(d))
      .filter((n) => n !== null)
      .join(",");

    const datesString = specificDates.join(",");

    try {
      const res = await fetch("/api/business/blockedDays/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          blockedWeekdays: weekdaysAsNumbers,
          blockedDates: datesString,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar los datos");

      toast("✔️ Cambios guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar días no laborables:", error);
      toast("⚠️❌ Hubo un error al guardar.");
    }
  };

  const addRangeToDates = () => {
    if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) return;

    const dates: string[] = [];
    // eslint-disable-next-line prefer-const
    let current = new Date(rangeStart);

    while (current <= new Date(rangeEnd)) {
      const formatted = current.toISOString().split("T")[0];
      if (!specificDates.includes(formatted)) dates.push(formatted);
      current.setDate(current.getDate() + 1);
    }

    setSpecificDates((prev) => [...prev, ...dates]);
    setRangeStart("");
    setRangeEnd("");
  };

  function getTodayDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  function weekdayToNumber(day: string): number | null {
    const map: Record<string, number> = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    return map[day] ?? null;
  }

  function weekdayFromNumber(n: number): string {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[n];
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fondo animado Beams */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#efefef"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="absolute top-4 left-4 z-20">
        <MenuDialog slug={slug} />
      </div>

      {/* Contenido */}
      <div className="relative z-10 mt-10 flex flex-col items-center justify-start text-white px-4 py-10 min-h-screen overflow-y-auto max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold drop-shadow-lg">
            Días No Laborables
          </h1>
          <p className="text-lg mt-2 drop-shadow">
            Configurá los días en los que no trabajas.
          </p>
        </div>

        {/* Días de la semana */}
        <section className="mb-12 w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Días de la semana
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ].map((day) => (
              <button
                key={day}
                onClick={() =>
                  setSelectedWeekdays((prev) =>
                    prev.includes(day)
                      ? prev.filter((d) => d !== day)
                      : [...prev, day]
                  )
                }
                className={`px-4 py-2 rounded-md font-medium border transition-all ${
                  selectedWeekdays.includes(day)
                    ? "bg-red-600 text-white border-red-800"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        {/* Fechas específicas */}
        <section className="mb-12 w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Fechas específicas
          </h2>

          <div className="flex justify-center mb-6 gap-2 flex-wrap">
            <input
              type="date"
              min={getTodayDate()}
              className="bg-white/10 text-white border border-white/20 p-2 rounded-md"
              onChange={(e) => {
                const value = e.target.value;
                if (value && !specificDates.includes(value)) {
                  setSpecificDates((prev) => [...prev, value]);
                }
              }}
            />
            <span className="text-sm self-center opacity-70">
              ← Agregar una sola fecha
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-4 text-black">
            <input
              type="date"
              value={rangeStart}
              min={getTodayDate()}
              onChange={(e) => setRangeStart(e.target.value)}
              className="bg-white/90 p-2 rounded-md"
            />
            <span className="self-center text-white">a</span>
            <input
              type="date"
              value={rangeEnd}
              min={getTodayDate()}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="bg-white/90 p-2 rounded-md"
            />
            <button
              onClick={addRangeToDates}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Agregar Rango
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {specificDates.map((date) => (
              <div
                key={date}
                className="flex items-center gap-2 bg-red-500/80 text-white px-3 py-1 rounded-full"
              >
                <span>{date}</span>
                <button
                  className="text-xs hover:text-black"
                  onClick={() =>
                    setSpecificDates((prev) => prev.filter((d) => d !== date))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Botón de guardar */}
        <div className="text-center w-full mt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
            onClick={handleSave}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
