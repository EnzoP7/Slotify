"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReservationList({ slug }: { slug: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/business/${slug}/dashboard/reservations?date=${new Date().toISOString().split("T")[0]}`
    )
      .then((res) => res.json())
      .then((data) => setReservations(data.reservations))
      .finally(() => setLoading(false));
  }, [slug]);

  return loading ? (
    <p>Cargando...</p>
  ) : reservations.length === 0 ? (
    <p>No tenés reservas para hoy.</p>
  ) : (
    <div className="flex flex-col gap-4">
      {reservations.map((r) => (
        <Card key={r.id}>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {r.name} {r.lastName}
            </h3>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <p>
                <strong>Hora:</strong>{" "}
                {new Date(r.dateTime).toLocaleTimeString()}
              </p>
              <p>
                <strong>Email:</strong> {r.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {r.phone}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Confirmar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
