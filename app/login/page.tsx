import { Suspense } from "react";
import BusinessLoginPageComponent from "./businessLoginComponent";
export default function BusinessLoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BusinessLoginPageComponent />
    </Suspense>
  );
}
