"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Beams from "@/src/UX/Bean";

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

  const fetchReservations = async () => {
    let endpoint = "";

    if (activeTab === "confirmed") {
      endpoint = `/api/business/reservations/activeReservations/${slug}?date=${selectedDate}`;
    } else {
      endpoint = `/api/business/reservations/pendingReservations/${slug}`;
    }

    const res = await fetch(endpoint);
    const data = await res.json();
    setReservations(data);
  };

  const handleConfirm = async (id: string) => {
    await fetch(`/api/business/reservations/${id}/confirm`, { method: "POST" });
    fetchReservations();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/business/reservations/${id}/reject`, { method: "POST" });
    fetchReservations();
  };

  useEffect(() => {
    fetchReservations();
  }, [selectedDate, activeTab]);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
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

      <div className="relative z-10 p-6 max-w-xl mx-auto bg-white mt-10 rounded-4xl">
        <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "confirmed" ? "default" : "outline"}
            onClick={() => setActiveTab("confirmed")}
          >
            Reservas Confirmadas
          </Button>
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => setActiveTab("pending")}
          >
            Reservas Pendientes
          </Button>
        </div>

        {activeTab === "confirmed" && (
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-64 mb-6"
          />
        )}

        {reservations.length === 0 ? (
          <p>
            No hay reservas{" "}
            {activeTab === "confirmed" ? "confirmadas" : "pendientes"}.
          </p>
        ) : (
          reservations.map((res) => (
            <Card
              key={res.id}
              className="mb-4 bg-white/80 backdrop-blur-md border-none shadow-md"
            >
              <CardHeader>
                <CardTitle>
                  {res.name} {res.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>📧 {res.email}</p>
                <p>📞 {res.phone}</p>
                <p>🕐 {format(new Date(res.dateTime), "HH:mm")}</p>
                <p>📌 Estado: {res.status}</p>

                {activeTab === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleConfirm(res.id)}
                      className="bg-green-500"
                    >
                      Confirmar
                    </Button>
                    <Button
                      onClick={() => handleReject(res.id)}
                      variant="destructive"
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
