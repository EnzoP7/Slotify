"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Silk from "@/src/UX/slick";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BusinessLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/business/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("QUE TRAE LA DATA: ", data);
    console.log("QUE TRAE LA DATA BUSSINES: ", data.business);

    if (!res.ok) {
      console.log(data.message || "Error al iniciar sesión");
      return;
    }

    const redirectTo = searchParams.get("redirectTo");
    const redirect = redirectTo ?? `/business/dashboard/${data.business.slug}`;
    console.log("Com nos queda el redirect: ", redirect);

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
                  required
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
                  required
                />
              </div>
              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
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
