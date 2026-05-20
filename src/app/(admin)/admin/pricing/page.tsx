import prisma from "@/lib/prisma";
import { PricingClient } from "./PricingClient";
import { SectionHeader } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const [plans, services] = await Promise.all([
    prisma.pricingPlan.findMany({
      include: { service: { select: { name: true, category: true } } },
      orderBy: { price: "asc" },
    }).catch(() => []),
    prisma.service.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Pricing Configuration"
        description="Manage base rates, pricing plans, and add-on costs"
      />

      <PricingClient plans={plans} services={services} />
    </div>
  );
}
