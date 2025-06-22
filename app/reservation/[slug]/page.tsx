import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReservationStepper from "@/src/components/ReservationStepper";
import ClientBackground from "@/src/components/ClientBackground";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ReservationPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  const business = await prisma.business.findUnique({
    where: { slug },
  });

  if (!business) return notFound();

  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      <ClientBackground />

      <div className="relative z-10 p-6 min-h-screen flex items-center justify-center ">
        <ReservationStepper
          businessId={business.id}
          slug={business.slug}
          businessName={business.name}
          blockedDates={business.blockedDates?.toString() ?? ""}
          blockedWeekdays={business.blockedWeekdays?.toString() ?? ""}
        />
      </div>
    </main>
  );
}
