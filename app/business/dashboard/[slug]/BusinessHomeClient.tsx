// app/business/[slug]/dashboard/BusinessHomeClient.tsx
"use client";

import { cn } from "@/lib/utils";
import Beams from "@/src/UX/Bean";
import { Ban, CalendarDays, Clock, Settings } from "lucide-react";

export default function BusinessHomeClient({
  business,
  slug,
}: {
  business: { name: string };
  slug: string;
}) {
  const actions = [
    {
      title: "Ver Reservas",
      description: "Consulta y administra las reservas del día.",
      icon: <CalendarDays className="h-10 w-10 text-indigo-500" />,
      endpoint: `/business/reservations/${slug}`,
    },
    {
      title: "Configurar Horarios",
      description: "Ajusta los días y horas de atención.",
      icon: <Clock className="h-10 w-10 text-emerald-500" />,
      endpoint: `/business/schedule/${slug}`,
    },
    {
      title: "Días no laborables",
      description: "Bloquea días especiales o vacaciones.",
      icon: <Ban className="h-10 w-10 text-red-500" />,
      endpoint: `/business/blocked-days/${slug}`,
    },
    {
      title: "Ajustes del Negocio",
      description: "Modifica datos del negocio o tu cuenta.",
      icon: <Settings className="h-10 w-10 text-yellow-500" />,
      endpoint: `/business/settings/${slug}`,
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-start text-white px-4 py-10 min-h-screen overflow-y-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Panel del Negocio
          </h1>
          <p className="text-lg max-w-md mx-auto mb-10 drop-shadow">
            Bienvenido, {business.name}. Selecciona una opción para comenzar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 cursor-pointer">
          {actions.map(({ title, description, icon, endpoint }) => (
            <div
              key={title}
              className={cn(
                "bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg p-6 w-full max-w-[250px] hover:scale-[1.03] transition-transform duration-200",
                "flex flex-col items-center text-center space-y-4 cursor-pointer"
              )}
              onClick={() => (window.location.href = endpoint)}
            >
              {icon}
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm opacity-80">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
