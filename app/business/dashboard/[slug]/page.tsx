// app/business/[slug]/dashboard/page.tsx

import type { Metadata } from "next";
import { checkBusinessAccess } from "@/lib/auth/checkBusinessSlug";
import BusinessHomeClient from "./BusinessHomeClient";

type Props = {
  params: {
    slug: string;
  };
};

// ✅ Generación dinámica de metadata con datos reales del negocio
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await checkBusinessAccess(params.slug);

  return {
    title: `Panel de ${business.name}`,
    description: `Administración del negocio ${business.name}`,
  };
}

// ✅ Página principal del panel del negocio
export default async function Page({ params }: Props) {
  const business = await checkBusinessAccess(params.slug);
  return <BusinessHomeClient business={business} />;
}
