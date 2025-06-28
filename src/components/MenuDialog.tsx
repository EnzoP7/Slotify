"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LogOut,
  Menu as MenuIcon,
  CalendarDays,
  Clock,
  Home,
  Ban,
} from "lucide-react";

interface Props {
  slug: string;
}

export default function MenuDialog({ slug }: Props) {
  const handleNavigate = (endpoint: string) => {
    window.location.href = endpoint;
  };

  return (
    <Dialog>
      {/* Botón que abre el menú */}
      <DialogTrigger asChild>
        <button className="p-2 rounded-md border bg-transparent text-black hover:bg-gray-100">
          <MenuIcon className="h-5 w-5 fill-white stroke-white" />
        </button>
      </DialogTrigger>

      {/* Contenido del menú */}
      <DialogContent className="w-full max-w-xs bg-white rounded-lg shadow-lg border text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Menú de Opciones
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <MenuItem
            icon={<Home className="w-5 h-5" />}
            label="Inicio"
            onClick={() => handleNavigate(`/business/dashboard/${slug}`)}
          />
          <MenuItem
            icon={<CalendarDays className="w-5 h-5" />}
            label="Reservas"
            onClick={() => handleNavigate(`/business/reservations/${slug}`)}
          />

          <MenuItem
            icon={<Clock className="w-5 h-5" />}
            label="Configurar Horarios"
            onClick={() => handleNavigate(`/business/schedule/${slug}`)}
          />

          <MenuItem
            icon={<Ban className="w-5 h-5" />}
            label="Días no laborables"
            onClick={() => handleNavigate(`/business/blockedDays/${slug}`)}
          />

          {/* <MenuItem
            icon={<Settings className="w-5 h-5" />}
            label="Ajustes del Negocio"
            onClick={() => handleNavigate(`/business/blockedDays/${slug}`)}
          /> */}

          <MenuItem
            icon={<LogOut className="w-5 h-5" />}
            label="Cerrar sesión"
            onClick={() => handleNavigate(`/login`)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
