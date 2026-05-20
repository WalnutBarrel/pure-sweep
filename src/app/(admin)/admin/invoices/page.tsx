import prisma from "@/lib/prisma";
import { InvoicesClient } from "./InvoicesClient";
import { SectionHeader } from "@/components/admin/DataTable";
import { serialize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const [invoices, customers, bookings] = await Promise.all([
    prisma.invoice.findMany({
      include: {
        customer: true,
        booking: true,
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.customer.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
    prisma.booking.findMany({
      include: { customer: true },
      orderBy: { preferredDate: "desc" },
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Billing Ledger"
        description={`${invoices.length} active generated invoices tracked`}
      />

      <InvoicesClient
        invoices={serialize(invoices)}
        customers={serialize(customers)}
        bookings={serialize(bookings)}
      />
    </div>
  );
}
