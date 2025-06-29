"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Silk from "@/src/UX/slick";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showErrorToast } from "@/lib/toast/showErrorToast";

export default function BusinessLoginPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación previa
    if (!email.trim() || !password.trim()) {
      showErrorToast("Debes completar todos los campos.");
      return;
    }

    const res = await fetch("/api/business/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showErrorToast(data.message || "Error al iniciar sesión");
      return;
    }

    const redirectTo = searchParams.get("redirectTo");
    const redirect = redirectTo ?? `/business/dashboard/${data.business.slug}`;

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="flex justify-center items-center min-h-screen relative z-10">
        <Card className="w-[350px] bg-white/80 backdrop-blur-md shadow-2xl border-none">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Iniciar Sesión - Negocio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
