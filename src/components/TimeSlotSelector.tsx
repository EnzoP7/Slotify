"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  slug: string;
  date: Date;
  onSelect: (time: string) => void;
}

export default function TimeSlotSelector({ slug, date, onSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      setLoading(true);
      setSlots([]);
      setSelectedSlot(null);
      setError(null);

      try {
        const res = await fetch(`/api/business/hoursAvailable/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            date: date.toISOString().split("T")[0],
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al obtener turnos");

        const available = data.availableSlots || [];
        setSlots(available);

        // Auto-seleccionar el primer slot disponible
        if (available.length > 0) {
          setSelectedSlot(available[0]);
          onSelect(available[0]);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Algo salió mal");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [slug, date, onSelect]);

  const handleSelect = (time: string) => {
    setSelectedSlot(time);
    onSelect(time);
  };

  if (!date) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-center">Horarios disponibles</h3>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {!loading && slots.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No hay turnos disponibles para esta fecha.
        </p>
      )}

      <div className="flex flex-wrap gap-2 justify-center transition-all">
        {slots.map((time) => (
          <Button
            key={time}
            variant={selectedSlot === time ? "default" : "outline"}
            onClick={() => handleSelect(time)}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
}
