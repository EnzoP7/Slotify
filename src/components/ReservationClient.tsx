// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// // import ReservationCalendar from "@/src/components/CalendarComponent";
// // import TimeSlotSelector from "@/src/components/TimeSlotSelector";

// interface Props {
//   slug: string;
//   businessName: string;
// }

// export default function ReservationClient({ slug, businessName }: Props) {
//   // const [date, setDate] = useState<Date | undefined>(new Date());
//   // const [selectedTime, setSelectedTime] = useState<string | null>(null);

//   const handleConfirm = () => {
//     if (!date || !selectedTime) return;

//     // Aquí podrías hacer el fetch a tu endpoint de reservas
//     console.log("Reservando:", {
//       date,
//       time: selectedTime,
//       slug,
//       businessName,
//     });
//   };

//   return (
//     <>
//       <p className="text-center text-gray-600">
//         Selecciona una fecha para tu reserva
//       </p>

//       {/* <ReservationCalendar date={date} setDate={setDate} />

//       <TimeSlotSelector slug={slug} date={date} onSelect={setSelectedTime} /> */}

//       <Button
//         className="w-full mt-4"
//         disabled={!selectedTime}
//         onClick={handleConfirm}
//       >
//         Confirmar Reserva
//       </Button>
//     </>
//   );
// }
