import prisma from "@/lib/prisma";
import { BookingsClient } from "./BookingsClient";
import { SectionHeader } from "@/components/admin/DataTable";
import { serialize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const [bookings, customers, staff, services] = await Promise.all([
    prisma.booking.findMany({
      include: {
        customer: true,
        bookingItems: true,
        staffBookings: true,
      },
      orderBy: { preferredDate: "desc" },
    }).catch(() => []),
    prisma.customer.findMany({
      orderBy: { name: "asc" },
    }).catch(() => []),
    prisma.staff.findMany({
      where: { isActive: true },
      orderBy: { firstName: "asc" },
    }).catch(() => []),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Reservations & Bookings"
        description={`${bookings.length} jobs scheduled in the Auckland region`}
      />

      <BookingsClient
        bookings={serialize(bookings)}
        customers={serialize(customers)}
        staff={serialize(staff)}
        services={serialize(services)}
      />
    </div>
  );
}
