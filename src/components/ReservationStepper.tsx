"use client";

import { useState } from "react";
import Stepper, { Step } from "@/src/UX/Stepper/stepper";
import ReservationCalendar from "@/src/components/CalendarComponent";
import TimeSlotSelector from "@/src/components/TimeSlotSelector";

interface Props {
  businessId: string;
  slug: string;
  businessName: string;
  blockedDates: string;
  blockedWeekdays: string;
}

export default function ReservationStepper({
  businessId,
  slug,
  businessName,
  blockedDates,
  blockedWeekdays,
}: Props) {
  const [customerName, setCustomerName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const confirmReservation = async () => {
    if (!selectedDate || !selectedSlot) return;
    setLoading(true);

    try {
      // const [hour, minute] = selectedSlot.split(":").map(Number);

      // Extraer fecha YYYY-MM-DD
      const yyyyMMdd = selectedDate.toISOString().split("T")[0];

      // Armamos un string con zona horaria explícita de Uruguay
      const dateTimeLocal = `${yyyyMMdd}T${selectedSlot}:00-03:00`;

      console.log("🧪 Fecha final armada con zona horaria:", dateTimeLocal);

      const res = await fetch("/api/reservation/registrerReservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          slug,
          name: customerName,
          lastName,
          phone,
          email,
          dateTime: dateTimeLocal,
          slot: selectedSlot,
        }),
      });

      if (!res.ok) throw new Error("No se pudo crear la reserva");

      const { reservation } = await res.json();
      // Enviar notificación al negocio (si el email está presente)
      await fetch("/api/email/notifyBusinessReservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: reservation?.business?.email ?? "admin@tusitio.com", // fallback
          customerName: customerName + " " + lastName,
          dateTime: dateTimeLocal,
          businessName,
          slug: reservation?.business?.slug,
        }),
      });
    } catch (err) {
      console.error("❌ Error al confirmar reserva:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("Que fechas bloqueadas llegan al Stepper: ", blockedDates);

  return (
    <Stepper
      initialStep={1}
      backButtonText="Anterior"
      nextButtonText="Siguiente"
      disableStepIndicators={true}
      onStepChange={(newStep) => {
        setStep(newStep);
        // Confirmación se ejecuta al pasar al paso 5 (antes del último)
        if (newStep === 5) confirmReservation();
      }}
      backButtonProps={{
        disabled: step === 5,
        style: step === 5 ? { display: "none" } : {},
        // si el paso es el último, desactivamos el botón "Anterior"
      }}
      nextButtonProps={{
        disabled:
          (step === 1 &&
            (customerName.trim() === "" ||
              lastName.trim() === "" ||
              email.trim() === "" ||
              phone.trim() === "")) ||
          (step === 2 && !selectedDate) ||
          (step === 3 && !selectedSlot) ||
          (step === 4 && loading),
        style: step === 5 ? { display: "none" } : {},
      }}
    >
      {/* Paso 1 – Nombre */}
      <Step>
        <div className="max-w-md mx-auto space-y-6 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              Reserva para {businessName}
            </h2>
            <p className="text-muted-foreground">
              ¡Bienvenido! Completá tus datos para comenzar.
            </p>
          </div>

          <div className="flex gap-4">
            <input
              className="input input-bordered border-2 placeholder:pl-1 border-black w-full rounded-md shadow-sm placeholder-black  text-black"
              placeholder="Nombre"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              className="input input-bordered border-2 placeholder:pl-1 border-black  w-full rounded-md shadow-sm placeholder-black  text-black"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            className="input input-bordered border-2 placeholder:pl-1 border-black w-full rounded-md shadow-sm placeholder-black text-black"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input input-bordered border-2 placeholder:pl-1 border-black w-full rounded-md shadow-sm placeholder-black  text-black"
            placeholder="Teléfono"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </Step>

      {/* Paso 2 – Fecha */}
      <Step>
        <h2 className="text-xl font-semibold mb-4  text-black">
          Seleccioná la fecha
        </h2>

        <ReservationCalendar
          date={selectedDate}
          setDate={setSelectedDate}
          blockedDates={blockedDates}
          blockedWeekdays={blockedWeekdays}
        />
      </Step>

      {/* Paso 3 – Horario */}
      <Step>
        <h2 className="text-xl font-semibold mb-4  text-black">
          Seleccioná el horario
        </h2>
        {selectedDate && (
          <TimeSlotSelector
            slug={slug}
            date={selectedDate}
            onSelect={setSelectedSlot}
          />
        )}
      </Step>

      {/* Paso 4 – Confirmación */}
      <Step>
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold  text-black">Resumen de Reserva</h2>
          <p className=" text-black">
            {customerName}, estás por reservar para el{" "}
            {selectedDate?.toLocaleDateString()} a las {selectedSlot}.<br />
            ¿Confirmás esta reserva?
          </p>
          {loading && <p className="text-sm">Enviando…</p>}
        </div>
      </Step>

      {/* Paso 5 – Final */}
      <Step>
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Solicitud de reserva enviada</h2>
          <p>
            Hemos recibido tu solicitud. En breve te enviaremos un correo
            confirmando si la reserva fue aprobada o rechazada.
          </p>
          <p className="text-sm text-muted-foreground">
            ¡Gracias por elegirnos!
          </p>
        </div>
      </Step>
    </Stepper>
  );
}
