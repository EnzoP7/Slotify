"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Beams from "@/src/UX/Bean";
import { Trash2, PlusCircle, Save } from "lucide-react";
import { toast } from "sonner";
import MenuDialog from "@/src/components/MenuDialog";

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

type Block = { startTime: string; endTime: string; slotDuration: number };

export default function BusinessScheduleConfig() {
  const { slug } = useParams() as { slug: string };
  const [schedules, setSchedules] = useState<Record<number, Block[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/business/schedules/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      const grouped = (data.schedules ?? []).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: Record<number, Block[]>, cur: any) => {
          (acc[cur.weekday] ||= []).push({
            startTime: cur.startTime,
            endTime: cur.endTime,
            slotDuration: cur.slotDuration ?? 30,
          });
          return acc;
        },
        {}
      );
      setSchedules(grouped);
      setLoading(false);
    })();
  }, [slug]);

  const handleChange = (
    day: number,
    idx: number,
    field: keyof Block,
    val: string | number
  ) => {
    const updated = [...(schedules[day] || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setSchedules({ ...schedules, [day]: updated });
  };

  const addBlock = (day: number) => {
    setSchedules({
      ...schedules,
      [day]: [
        ...(schedules[day] || []),
        { startTime: "", endTime: "", slotDuration: 30 },
      ],
    });
  };

  const removeBlock = (day: number, idx: number) => {
    const updated = [...(schedules[day] || [])];
    updated.splice(idx, 1);
    setSchedules({ ...schedules, [day]: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = Object.entries(schedules).flatMap(([day, blocks]) =>
      blocks.map((b) => ({
        weekday: Number(day),
        startTime: b.startTime,
        endTime: b.endTime,
        slotDuration: b.slotDuration,
      }))
    );

    const res = await fetch("/api/business/schedules/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, schedules: payload }),
    });

    setSaving(false);
    toast(res.ok ? "✔️Cambios guardados" : "❌Error al guardar");
  };

  if (loading) return <p className="text-white p-8">Cargando…</p>;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-white">
        <div className="bg-white/10 mt-5 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-center mb-10 drop-shadow">
            Configuración de Horarios
          </h1>

          <div className="space-y-8">
            {days.map((name, index) => (
              <div key={index}>
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/30 pb-2">
                  {name}
                </h2>

                {(schedules[index] || []).map((block, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-3"
                  >
                    <Input
                      type="time"
                      value={block.startTime}
                      onChange={(e) =>
                        handleChange(index, idx, "startTime", e.target.value)
                      }
                      className="bg-white/90 text-black flex-1 shadow-sm"
                    />
                    <Input
                      type="time"
                      value={block.endTime}
                      onChange={(e) =>
                        handleChange(index, idx, "endTime", e.target.value)
                      }
                      className="bg-white/90 text-black flex-1 shadow-sm"
                    />
                    <select
                      value={block.slotDuration}
                      onChange={(e) =>
                        handleChange(
                          index,
                          idx,
                          "slotDuration",
                          Number(e.target.value)
                        )
                      }
                      className="bg-white/90 text-black px-2 py-1 rounded-md shadow-sm"
                    >
                      {[15, 30, 45, 60, 90].map((d) => (
                        <option key={d} value={d}>
                          {d} min
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="destructive"
                      onClick={() => removeBlock(index, idx)}
                      className="px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() => addBlock(index)}
                  className="mt-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  Añadir bloque
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              disabled={saving}
              onClick={handleSave}
              className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "Guardando…" : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
