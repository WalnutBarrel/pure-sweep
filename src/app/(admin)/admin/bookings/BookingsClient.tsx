/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
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
import Link from "next/link";

type BookingFormValues = z.infer<typeof adminBookingSchema>;

interface BookingsClientProps {
  bookings: any[];
  customers: any[];
  staff: any[];
  services: any[];
}

export function BookingsClient({ bookings: initialBookings, customers, staff, services }: BookingsClientProps) {
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

  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus lock and Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus drawer on open for accessibility
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(adminBookingSchema) as any,
    defaultValues: {
      customerId: "",
      serviceId: "",
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

  // Watch totalPrice to calculate GST and Grand Total dynamically
  const watchedTotalPrice = watch("totalPrice");
  const subtotalVal = Number(watchedTotalPrice) || 0;
  const gstVal = Math.round(subtotalVal * 0.15 * 100) / 100;
  const grandTotalVal = Math.round((subtotalVal + gstVal) * 100) / 100;

  // Sync calculated values with react-hook-form state
  useEffect(() => {
    setValue("gstAmount", gstVal);
    setValue("grandTotal", grandTotalVal);
  }, [gstVal, grandTotalVal, setValue]);

  const openCreate = () => {
    setEditingBooking(null);
    reset({
      customerId: customers[0]?.id || "",
      serviceId: services[0]?.id || "",
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
      serviceId: booking.bookingItems?.[0]?.serviceId || services[0]?.id || "",
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
      // Ensure current subtotal/GST/total are calculated correctly
      const subtotal = Number(data.totalPrice) || 0;
      const gst = Math.round(subtotal * 0.15 * 100) / 100;
      const total = Math.round((subtotal + gst) * 100) / 100;

      const submitData = {
        ...data,
        gstAmount: gst,
        grandTotal: total,
      };

      if (editingBooking) {
        res = await updateBookingAdmin(editingBooking.id, submitData);
      } else {
        res = await createBookingAdmin(submitData);
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
    const customerName = b.customer?.name?.toLowerCase() || "";
    const customerEmail = b.customer?.email?.toLowerCase() || "";
    const ref = b.bookingRef?.toLowerCase() || "";
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
              <p className="font-medium text-stone-800 text-[13px]">{b.customer?.name || "Unknown Customer"}</p>
              <p className="text-[11px] text-stone-400">{b.customer?.email || "No Email"}</p>
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

      {/* Slide-over Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-stone-900/35"
          onClick={() => setIsOpen(false)}
        >
          <div 
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="relative bg-white border-l border-stone-200 w-full sm:max-w-[90vw] md:w-[540px] h-screen flex flex-col shadow-2xl focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex justify-between items-center border-b border-stone-200 px-6 py-5 bg-white shrink-0">
              <h3 id="drawer-title" className="text-[15px] font-sans font-bold uppercase tracking-wider text-stone-900">
                {editingBooking ? "Modify Reservation" : "New Booking"}
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-stone-400 hover:text-stone-900 transition-colors p-1.5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-thin">
                {/* Customer Profile */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="customerId" className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500">
                      Customer Profile
                    </label>
                    <Link 
                      href="/admin/customers" 
                      target="_blank"
                      className="text-xs text-[#0F3D3E] hover:underline font-semibold flex items-center gap-1"
                    >
                      + Add Customer
                    </Link>
                  </div>
                  <select 
                    id="customerId" 
                    {...register("customerId")} 
                    className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                  {errors.customerId && <p className="text-xs text-red-600 mt-1">{errors.customerId.message as string}</p>}
                </div>

                {/* Service Option & Property Type Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="serviceId" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                      Service Option
                    </label>
                    <select 
                      id="serviceId" 
                      {...register("serviceId")} 
                      className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId && <p className="text-xs text-red-600 mt-1">{errors.serviceId.message as string}</p>}
                  </div>

                  <div>
                    <label htmlFor="propertyType" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                      Property Type
                    </label>
                    <select 
                      id="propertyType" 
                      {...register("propertyType")} 
                      className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                    >
                      <option value="House">Residential House</option>
                      <option value="Apartment">Apartment / Unit</option>
                      <option value="Office">Commercial Office</option>
                      <option value="Retail">Retail Store</option>
                    </select>
                    {errors.propertyType && <p className="text-xs text-red-600 mt-1">{errors.propertyType.message as string}</p>}
                  </div>
                </div>

                {/* Preferred Date & Preferred Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferredDate" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                      Preferred Date
                    </label>
                    <input 
                      type="date" 
                      id="preferredDate" 
                      {...register("preferredDate")} 
                      className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" 
                    />
                    {errors.preferredDate && <p className="text-xs text-red-600 mt-1">{errors.preferredDate.message as string}</p>}
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                      Preferred Time
                    </label>
                    <select 
                      id="preferredTime" 
                      {...register("preferredTime")} 
                      className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                    >
                      <option value="Morning">Morning (8am - 12pm)</option>
                      <option value="Afternoon">Afternoon (12pm - 4pm)</option>
                      <option value="Late Afternoon">Late Afternoon (4pm - 6pm)</option>
                    </select>
                    {errors.preferredTime && <p className="text-xs text-red-600 mt-1">{errors.preferredTime.message as string}</p>}
                  </div>
                </div>

                {/* Cleaning Frequency */}
                <div>
                  <label htmlFor="cleaningFrequency" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                    Cleaning Frequency
                  </label>
                  <select 
                    id="cleaningFrequency" 
                    {...register("cleaningFrequency")} 
                    className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                  >
                    <option value="One-off">One-off / Casual</option>
                    <option value="Weekly">Weekly Standard</option>
                    <option value="Fortnightly">Fortnightly Regular</option>
                    <option value="Monthly">Monthly Cycle</option>
                  </select>
                  {errors.cleaningFrequency && <p className="text-xs text-red-600 mt-1">{errors.cleaningFrequency.message as string}</p>}
                </div>

                {/* Status & Assignment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                      Reservation Status
                    </label>
                    <select 
                      id="status" 
                      {...register("status")} 
                      className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                    >
                      <option value="PENDING">Pending Approval</option>
                      <option value="CONFIRMED">Confirmed Schedule</option>
                      <option value="IN_PROGRESS">Clean In Progress</option>
                      <option value="COMPLETED">Completed Clean</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="assignedStaffId" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                      Assign Cleaner / Staff
                    </label>
                    <select 
                      id="assignedStaffId" 
                      {...register("assignedStaffId")} 
                      className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors"
                    >
                      <option value="">No Cleaner Assigned</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specific Instructions / Notes */}
                <div>
                  <label htmlFor="notes" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                    Specific Instructions / Notes
                  </label>
                  <textarea
                    id="notes"
                    {...register("notes")}
                    rows={3}
                    className="w-full border border-[#DDD6CC] bg-white rounded-none p-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans resize-none"
                    placeholder="Special client requirements, access codes, lockbox keys, etc."
                  />
                  {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes.message as string}</p>}
                </div>

                {/* Subtotal Input */}
                <div>
                  <label htmlFor="totalPrice" className="block text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                    Subtotal Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="totalPrice"
                    {...register("totalPrice", { valueAsNumber: true })}
                    className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-mono"
                  />
                  {errors.totalPrice && <p className="text-xs text-red-600 mt-1">{errors.totalPrice.message as string}</p>}
                </div>

                {/* Pricing Summary Box */}
                <div className="bg-[#FAF9F6] border border-[#DDD6CC] p-4 font-sans space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Pricing Summary</p>
                  <div className="flex justify-between items-center text-[13px] text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(subtotalVal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] text-stone-600">
                    <span>GST (15%)</span>
                    <span className="font-mono">{formatPrice(gstVal)}</span>
                  </div>
                  <div className="h-px bg-[#DDD6CC] my-1" />
                  <div className="flex justify-between items-center text-sm text-stone-900 font-bold">
                    <span>Grand Total</span>
                    <span className="font-mono">{formatPrice(grandTotalVal)}</span>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-stone-200 px-6 py-4 bg-white shrink-0 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto h-11 border border-[#DDD6CC] hover:bg-stone-50 text-stone-700 text-[11px] font-bold px-6 uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto h-11 bg-stone-900 hover:bg-stone-850 text-white text-[11px] font-bold px-8 uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
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
