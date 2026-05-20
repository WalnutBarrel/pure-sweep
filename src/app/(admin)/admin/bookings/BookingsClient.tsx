/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminBookingSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { createBookingAdmin, updateBookingAdmin, deleteBookingAdmin } from "@/actions/crud";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { z } from "zod";

type BookingFormValues = z.infer<typeof adminBookingSchema>;

interface BookingsClientProps {
  bookings: any[];
  customers: any[];
  staff: any[];
  services: any[];
}

export function BookingsClient({ bookings: initialBookings, customers, staff }: BookingsClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form & Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(adminBookingSchema) as any,
    defaultValues: {
      customerId: "",
      preferredDate: "",
      preferredTime: "Morning",
      status: "PENDING",
      notes: "",
      totalPrice: 0,
      gstAmount: 0,
      grandTotal: 0,
      assignedStaffId: "",
      propertyType: "House",
      cleaningFrequency: "One-off",
    },
  });

  const openCreate = () => {
    setEditingBooking(null);
    reset({
      customerId: customers[0]?.id || "",
      preferredDate: new Date().toISOString().split("T")[0],
      preferredTime: "Morning",
      status: "PENDING",
      notes: "",
      totalPrice: 150,
      gstAmount: 22.5,
      grandTotal: 172.5,
      assignedStaffId: "",
      propertyType: "House",
      cleaningFrequency: "One-off",
    });
    setIsOpen(true);
  };

  const openEdit = (booking: any) => {
    setEditingBooking(booking);
    reset({
      customerId: booking.customerId,
      preferredDate: new Date(booking.preferredDate).toISOString().split("T")[0],
      preferredTime: booking.preferredTime,
      status: booking.status,
      notes: booking.notes || "",
      totalPrice: Number(booking.totalPrice),
      gstAmount: Number(booking.gstAmount),
      grandTotal: Number(booking.grandTotal),
      assignedStaffId: booking.staffBookings?.[0]?.staffId || "",
      propertyType: booking.propertyType || "House",
      cleaningFrequency: booking.cleaningFrequency || "One-off",
    });
    setIsOpen(true);
  };

  const onSubmit = (data: BookingFormValues) => {
    startTransition(async () => {
      let res;
      if (editingBooking) {
        res = await updateBookingAdmin(editingBooking.id, data);
      } else {
        res = await createBookingAdmin(data);
      }

      if (res.success) {
        toast(editingBooking ? "Booking updated successfully" : "Booking created successfully");
        setIsOpen(false);
      } else {
        toast(res.message || "An error occurred", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteBookingAdmin(deleteConfirmId);
    if (res.success) {
      toast("Booking deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast(res.message || "Failed to delete booking", "error");
    }
  };

  // Filter & Search Logic
  const filteredBookings = initialBookings.filter((b) => {
    const customerName = b.customer.name.toLowerCase();
    const customerEmail = b.customer.email.toLowerCase();
    const ref = b.bookingRef.toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = customerName.includes(query) || customerEmail.includes(query) || ref.includes(query);
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters Strip */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 border border-stone-200">
        <div className="flex-1 flex gap-2 max-w-md items-center border border-stone-200 px-3 py-2 bg-stone-50/50">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by client or reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent outline-none text-[13px] text-stone-800 placeholder-stone-400 font-sans"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-stone-200 px-3 py-2 text-[12px] bg-white outline-none cursor-pointer text-stone-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            New Booking
          </button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable columns={["Ref", "Client", "Service Options", "Preferred Details", "Frequency", "Pricing", "Status", "Actions"]}>
        {paginatedBookings.map((b) => (
          <tr key={b.id} className="hover:bg-stone-50/50">
            <td className="px-4 py-3 font-mono text-[12px] font-semibold text-stone-600">
              {b.bookingRef}
            </td>
            <td className="px-4 py-3">
              <p className="font-medium text-stone-800 text-[13px]">{b.customer.name}</p>
              <p className="text-[11px] text-stone-400">{b.customer.email}</p>
            </td>
            <td className="px-4 py-3 text-[13px]">
              <p className="text-stone-800">{b.bookingItems?.[0]?.serviceName || "Signature Clean"}</p>
              <p className="text-[11px] text-stone-400 uppercase tracking-widest">{b.propertyType || "House"}</p>
            </td>
            <td className="px-4 py-3 text-[13px]">
              <p className="font-medium">
                {new Date(b.preferredDate).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
              </p>
              <p className="text-[11px] text-stone-400">{b.preferredTime}</p>
            </td>
            <td className="px-4 py-3 text-[12px] text-stone-500 font-medium">
              {b.cleaningFrequency || "One-off"}
            </td>
            <td className="px-4 py-3">
              <p className="font-mono text-[13px] font-semibold text-stone-800">
                {formatPrice(Number(b.grandTotal))}
              </p>
              <p className="text-[10px] text-stone-400 font-mono">
                Ex. GST: {formatPrice(Number(b.totalPrice))}
              </p>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(b)}
                  className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(b.id)}
                  className="p-1 hover:text-red-600 text-stone-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {filteredBookings.length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-stone-400 font-medium">
              No bookings found matching your search.
            </td>
          </tr>
        )}
      </DataTable>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-stone-200 px-4 py-3">
          <p className="text-[11px] font-mono text-stone-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Form Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white border-l border-stone-200 w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-enter-fade">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-[15px] font-semibold text-stone-900">
                {editingBooking ? "Modify Reservation" : "Register Clean Booking"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="form-label">Customer Profile</label>
                <select {...register("customerId")} className="form-select text-[13px]">
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="text-xs text-red-600 mt-1">{errors.customerId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Preferred Date</label>
                  <input type="date" {...register("preferredDate")} className="form-input text-[13px]" />
                  {errors.preferredDate && <p className="text-xs text-red-600 mt-1">{errors.preferredDate.message}</p>}
                </div>
                <div>
                  <label className="form-label">Preferred Time</label>
                  <select {...register("preferredTime")} className="form-select text-[13px]">
                    <option value="Morning">Morning (8am - 12pm)</option>
                    <option value="Afternoon">Afternoon (12pm - 4pm)</option>
                    <option value="Late Afternoon">Late Afternoon (4pm - 6pm)</option>
                  </select>
                  {errors.preferredTime && <p className="text-xs text-red-600 mt-1">{errors.preferredTime.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Property Type</label>
                  <select {...register("propertyType")} className="form-select text-[13px]">
                    <option value="House">Residential House</option>
                    <option value="Apartment">Apartment / Unit</option>
                    <option value="Office">Commercial Office</option>
                    <option value="Retail">Retail Store</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Cleaning Frequency</label>
                  <select {...register("cleaningFrequency")} className="form-select text-[13px]">
                    <option value="One-off">One-off / Casual</option>
                    <option value="Weekly">Weekly Standard</option>
                    <option value="Fortnightly">Fortnightly Regular</option>
                    <option value="Monthly">Monthly Cycle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="form-label">Subtotal ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("totalPrice")}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      // Auto calculate GST and Grand Total
                      const gst = Math.round(val * 0.15 * 100) / 100;
                      const total = Math.round((val + gst) * 100) / 100;
                      reset((prev) => ({
                        ...prev,
                        totalPrice: val,
                        gstAmount: gst,
                        grandTotal: total,
                      }));
                    }}
                    className="form-input text-[13px] font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">GST (15%)</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled
                    {...register("gstAmount")}
                    className="form-input text-[13px] font-mono bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="form-label">Grand Total</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled
                    {...register("grandTotal")}
                    className="form-input text-[13px] font-mono bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Reservation Status</label>
                <select {...register("status")} className="form-select text-[13px]">
                  <option value="PENDING">Pending Approval</option>
                  <option value="CONFIRMED">Confirmed Schedule</option>
                  <option value="IN_PROGRESS">Clean In Progress</option>
                  <option value="COMPLETED">Completed Clean</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="form-label">Assign Cleaner / Staff</label>
                <select {...register("assignedStaffId")} className="form-select text-[13px]">
                  <option value="">No Cleaner Assigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Specific Instructions / Notes</label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="form-textarea text-[13px]"
                  placeholder="Special client requirements, access codes, lockbox keys, etc."
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-700 text-[12px] font-bold py-3 uppercase tracking-widest cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-bold py-3 uppercase tracking-widest cursor-pointer text-center disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingBooking ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Booking"
          description="Are you absolutely sure you want to delete this booking reservation? This action will remove all pricing and item logs associated with it."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
