import prisma from "@/lib/prisma";
import { ServicesClient } from "./ServicesClient";
import { SectionHeader } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    include: { _count: { select: { bookingItems: true } }, pricingPlans: true },
    orderBy: { name: "asc" },
  }).catch(() => []);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Service Catalog"
        description={`${services.length} signature cleaning services configured`}
      />

      <ServicesClient services={services} />
    </div>
  );
}
