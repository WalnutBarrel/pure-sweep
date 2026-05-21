/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminInvoiceSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, StatusBadge } from "@/components/admin/DataTable";
import { createInvoice, updateInvoice, deleteInvoice } from "@/actions/crud";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { z } from "zod";

type InvoiceFormValues = z.infer<typeof adminInvoiceSchema>;

interface InvoicesClientProps {
  invoices: any[];
  customers: any[];
  bookings: any[];
}

export function InvoicesClient({ invoices: initialInvoices, customers, bookings }: InvoicesClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isOpen, setIsOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(adminInvoiceSchema) as any,
    defaultValues: {
      customerId: "",
      bookingId: "",
      issueDate: "",
      dueDate: "",
      subtotal: 0,
      gstAmount: 0,
      discount: 0,
      totalAmount: 0,
      status: "UNPAID",
    },
  });

  const openCreate = () => {
    setEditingInvoice(null);
    reset({
      customerId: customers[0]?.id || "",
      bookingId: bookings[0]?.id || "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +14 Days default due date
      subtotal: 150,
      gstAmount: 22.5,
      discount: 0,
      totalAmount: 172.5,
      status: "UNPAID",
    });
    setIsOpen(true);
  };

  const openEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    reset({
      customerId: invoice.customerId,
      bookingId: invoice.bookingId,
      issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
      dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
      subtotal: Number(invoice.subtotal),
      gstAmount: Number(invoice.gstAmount),
      discount: Number(invoice.discount || 0),
      totalAmount: Number(invoice.totalAmount),
      status: invoice.status,
    });
    setIsOpen(true);
  };

  const onSubmit = (data: InvoiceFormValues) => {
    startTransition(async () => {
      let res;
      if (editingInvoice) {
        res = await updateInvoice(editingInvoice.id, data);
      } else {
        res = await createInvoice(data);
      }

      if (res.success) {
        toast(editingInvoice ? "Invoice updated successfully" : "Invoice created successfully");
        setIsOpen(false);
      } else {
        toast(res.message || "An error occurred", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteInvoice(deleteConfirmId);
    if (res.success) {
      toast("Invoice deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast(res.message || "Failed to delete invoice", "error");
    }
  };

  const filteredInvoices = initialInvoices.filter((inv) => {
    const number = inv.invoiceNumber?.toLowerCase() || "";
    const customer = inv.customer?.name?.toLowerCase() || "";
    const query = search.toLowerCase();

    const matchesSearch = number.includes(query) || customer.includes(query);
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Filters & creation strip */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 border border-stone-200">
        <div className="flex-1 flex gap-2 max-w-md items-center border border-stone-200 px-3 py-2 bg-stone-50/50">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by invoice number or client..."
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
            <option value="ALL">All Payments</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Tables layout */}
      <DataTable columns={["Invoice No.", "Client", "Issue Date", "Due Date", "Subtotal", "GST", "Discount", "Total Payable", "Status", "Actions"]}>
        {paginatedInvoices.map((inv) => (
          <tr key={inv.id} className="hover:bg-stone-50/50">
            <td className="px-4 py-3 font-mono text-[13px] font-medium text-stone-800">
              {inv.invoiceNumber}
            </td>
            <td className="px-4 py-3">
              <p className="font-semibold text-stone-800 text-[13px]">{inv.customer?.name || "Unknown Customer"}</p>
              <p className="text-[11px] text-stone-400">Ref: {inv.booking?.bookingRef || "N/A"}</p>
            </td>
            <td className="px-4 py-3 text-[12px] text-stone-500">
              {new Date(inv.issueDate).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
            </td>
            <td className="px-4 py-3 text-[12px] text-stone-500 font-medium">
              {new Date(inv.dueDate).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
            </td>
            <td className="px-4 py-3 font-mono text-[13px]">{formatPrice(Number(inv.subtotal))}</td>
            <td className="px-4 py-3 font-mono text-[13px] text-stone-400">{formatPrice(Number(inv.gstAmount))}</td>
            <td className="px-4 py-3 font-mono text-[13px] text-red-600">
              {Number(inv.discount) > 0 ? `-${formatPrice(Number(inv.discount))}` : "—"}
            </td>
            <td className="px-4 py-3 font-mono text-[13px] font-semibold text-stone-800">
              {formatPrice(Number(inv.totalAmount))}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={inv.status} variant="payment" />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(inv)}
                  className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(inv.id)}
                  className="p-1 hover:text-red-600 text-stone-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {filteredInvoices.length === 0 && (
          <tr>
            <td colSpan={10} className="px-4 py-8 text-center text-[13px] text-stone-400 font-medium">
              No invoice records found.
            </td>
          </tr>
        )}
      </DataTable>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-stone-200 px-4 py-3">
          <p className="text-[11px] font-mono text-stone-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
                {editingInvoice ? "Modify Generated Invoice" : "Generate Billing Invoice Statement"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="form-label">Client Customer Profile</label>
                <select {...register("customerId")} className="form-select text-[13px]">
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="text-xs text-red-600 mt-1">{errors.customerId.message}</p>}
              </div>

              <div>
                <label className="form-label">Linked Reservation Job</label>
                <select {...register("bookingId")} className="form-select text-[13px]">
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      Ref: {b.bookingRef} &middot; {b.customer.name} ({new Date(b.preferredDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {errors.bookingId && <p className="text-xs text-red-600 mt-1">{errors.bookingId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Issue Date</label>
                  <input type="date" {...register("issueDate")} className="form-input text-[13px]" />
                  {errors.issueDate && <p className="text-xs text-red-600 mt-1">{errors.issueDate.message}</p>}
                </div>
                <div>
                  <label className="form-label">Due Date</label>
                  <input type="date" {...register("dueDate")} className="form-input text-[13px]" />
                  {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Subtotal Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("subtotal")}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      // Auto calculate GST and Grand Total
                      const gst = Math.round(val * 0.15 * 100) / 100;
                      reset((prev) => {
                        const discount = prev.discount || 0;
                        const total = Math.round((val + gst - discount) * 100) / 100;
                        return {
                          ...prev,
                          subtotal: val,
                          gstAmount: gst,
                          totalAmount: total,
                        };
                      });
                    }}
                    className="form-input text-[13px] font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">Discount Applied ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("discount")}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      reset((prev) => {
                        const sub = prev.subtotal || 0;
                        const gst = prev.gstAmount || 0;
                        const total = Math.round((sub + gst - val) * 100) / 100;
                        return {
                          ...prev,
                          discount: val,
                          totalAmount: total,
                        };
                      });
                    }}
                    className="form-input text-[13px] font-mono text-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 border border-stone-200">
                <div>
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">GST (15%)</p>
                  <input
                    type="number"
                    step="0.01"
                    disabled
                    {...register("gstAmount")}
                    className="mt-1 w-full bg-transparent border-0 font-mono text-[14px] text-stone-500 font-semibold p-0"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Net Statement Payable</p>
                  <input
                    type="number"
                    step="0.01"
                    disabled
                    {...register("totalAmount")}
                    className="mt-1 w-full bg-transparent border-0 font-mono text-[15px] text-stone-900 font-bold p-0"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Payment status</label>
                <select {...register("status")} className="form-select text-[13px]">
                  <option value="UNPAID">Unpaid Invoice</option>
                  <option value="PARTIAL">Partial Payment</option>
                  <option value="PAID">Settled / Paid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
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
                  {isPending ? "Saving..." : editingInvoice ? "Update" : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Invoice Statement"
          description="Are you absolutely sure you want to delete this invoice statement? Doing so will permanently clear the billing ledger and associated transactional records."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
