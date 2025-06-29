import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slotify | Gestión Inteligente de Reservas",
  description:
    "Slotify es la solución moderna para reservar turnos de forma rápida, sencilla y eficiente. Ideal para negocios, clínicas, peluquerías y más.",
  icons: {
    icon: "/slotifyLogo.ico", // o favicon.png si lo convertiste así
  },
  keywords: [
    "Slotify",
    "reservas online",
    "agenda digital",
    "turnos online",
    "gestión de citas",
    "sistema de reservas",
    "software para reservas",
    "agendamiento",
    "calendario online",
    "reservar citas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
