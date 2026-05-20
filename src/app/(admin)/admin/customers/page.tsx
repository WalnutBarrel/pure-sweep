import prisma from "@/lib/prisma";
import { CustomersClient } from "./CustomersClient";
import { SectionHeader } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: {
        select: {
          bookings: true,
          invoices: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Customer Directory"
        description={`${customers.length} registered accounts across central Auckland`}
      />

      <CustomersClient customers={customers} />
    </div>
  );
}
