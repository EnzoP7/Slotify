"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Beams from "@/src/UX/Bean";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    return `598${cleaned.slice(1)}`; // Uruguay, elimina 0
  }
  return `598${cleaned}`;
};

export default function ReservationPage() {
  const { slug } = useParams();
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reservations, setReservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"confirmed" | "pending">(
    "confirmed"
  );
  const [action, setAction] = useState<null | (() => void)>(null);
  const [confirmMsg, setConfirmMsg] = useState<string>("");

  /* ---------------------- data fetch ---------------------- */
  const fetchReservations = async () => {
    const endpoint =
      activeTab === "confirmed"
        ? `/api/business/reservations/activeReservations/${slug}?date=${selectedDate}`
        : `/api/business/reservations/pendingReservations/${slug}`;

    const res = await fetch(endpoint);
    const data = await res.json();
    setReservations(data);
  };

  /* ---------------------- dialog helpers ------------------ */
  const confirmAction = () => {
    if (action) action();
    setAction(null);
  };

  const requestConfirm = (fn: () => void, message: string) => {
    setAction(() => fn);
    setConfirmMsg(message);
    const dialogBtn = document.getElementById("reservation-dialog-btn");
    if (dialogBtn) (dialogBtn as HTMLButtonElement).click();
  };

  /* ---------------------- handlers ------------------------ */
  const handleConfirm = (id: string) =>
    requestConfirm(async () => {
      await fetch(`/api/business/reservations/confirm/${id}`, {
        method: "POST",
      });
      fetchReservations();
    }, "Esto confirmará la reserva y notificará al cliente.");

  const handleReject = (id: string) =>
    requestConfirm(async () => {
      await fetch(`/api/business/reservations/reject/${id}`, {
        method: "POST",
      });
      fetchReservations();
    }, "Esto rechazará la reserva y notificará al cliente.");

  const handleMarkPending = (id: string) =>
    requestConfirm(async () => {
      await fetch(`/api/business/reservations/mark-pending/${id}`, {
        method: "POST",
      });
      fetchReservations();
    }, "Esto moverá la reserva al estado Pendiente.");

  const handleCancel = (id: string) =>
    requestConfirm(async () => {
      await fetch(`/api/business/reservations/cancel/${id}`, {
        method: "POST",
      });
      fetchReservations();
    }, "Esto cancelará la reserva de forma permanente.");

  /* ---------------------- lifecycle ----------------------- */
  useEffect(() => {
    fetchReservations();
  }, [selectedDate, activeTab]);

  /* ---------------------- UI ------------------------------ */
  return (
    <div className="relative w-screen min-h-screen overflow-hidden text-white">
      {/* Background */}
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

      {/* Card container */}
      <div className="relative z-10 p-6 max-w-2xl mx-auto mt-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Gestión de Reservas
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setActiveTab("confirmed")}
            className={
              activeTab === "confirmed"
                ? "bg-white text-black shadow-md outline outline-2 outline-white"
                : "border-white text-white bg-white/10 hover:bg-white/20"
            }
          >
            Reservas Confirmadas
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab("pending")}
            className={
              activeTab === "pending"
                ? "bg-white text-black shadow-md outline outline-2 outline-white"
                : "border-white text-white bg-white/10 hover:bg-white/20"
            }
          >
            Reservas Pendientes
          </Button>
        </div>

        {activeTab === "confirmed" && (
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-64 mb-6 bg-white/10 text-white border-white/20"
          />
        )}

        {/* Reservation list */}
        {reservations.length === 0 ? (
          <p className="text-center text-white/80">
            No hay reservas{" "}
            {activeTab === "confirmed" ? "confirmadas" : "pendientes"}.
          </p>
        ) : (
          reservations.map((res) => (
            <Card
              key={res.id}
              className="mb-4 bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {res.name} {res.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-white/90 text-lg">
                <p>📧 {res.email}</p>
                <p>📞 {res.phone}</p>
                <p>
                  🕐 {format(new Date(res.dateTime), "dd/MM/yyyy")} a las{" "}
                  {format(new Date(res.dateTime), "HH:mm")}
                </p>
                <p>📌 Estado: {res.status}</p>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeTab === "pending" ? (
                    <>
                      <Button
                        onClick={() => handleConfirm(res.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Confirmar
                      </Button>
                      <Button
                        onClick={() => handleReject(res.id)}
                        variant="destructive"
                      >
                        Rechazar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleMarkPending(res.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black"
                      >
                        Marcar como Pendiente
                      </Button>
                      <Button
                        onClick={() => handleCancel(res.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  <a
                    href={`https://wa.me/${formatPhone(res.phone)}?text=Hola%20${encodeURIComponent(res.name)},%20te%20contactamos%20por%20tu%20reserva%20el%20${format(new Date(res.dateTime), "dd/MM/yyyy")}%20a%20las%20${format(new Date(res.dateTime), "HH:mm")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      Enviar WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button id="reservation-dialog-btn" className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
            <AlertDialogDescription>{confirmMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
