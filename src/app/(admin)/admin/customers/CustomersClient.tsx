/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCustomerSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { createCustomer, updateCustomer, deleteCustomer } from "@/actions/crud";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { z } from "zod";

type CustomerFormValues = z.infer<typeof adminCustomerSchema>;

interface CustomersClientProps {
  customers: any[];
}

export function CustomersClient({ customers: initialCustomers }: CustomersClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(adminCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      suburb: "",
      notes: "",
    },
  });

  const openCreate = () => {
    setEditingCustomer(null);
    reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      suburb: "",
      notes: "",
    });
    setIsOpen(true);
  };

  const openEdit = (customer: any) => {
    setEditingCustomer(customer);
    reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      suburb: customer.suburb || "",
      notes: customer.notes || "",
    });
    setIsOpen(true);
  };

  const onSubmit = (data: CustomerFormValues) => {
    startTransition(async () => {
      let res;
      if (editingCustomer) {
        res = await updateCustomer(editingCustomer.id, data);
      } else {
        res = await createCustomer(data);
      }

      if (res.success) {
        toast(editingCustomer ? "Customer updated successfully" : "Customer registered successfully");
        setIsOpen(false);
      } else {
        toast(res.message || "An error occurred", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteCustomer(deleteConfirmId);
    if (res.success) {
      toast("Customer deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast(res.message || "Failed to delete customer", "error");
    }
  };

  const filteredCustomers = initialCustomers.filter((c) => {
    const name = c.name.toLowerCase();
    const email = c.email.toLowerCase();
    const suburb = (c.suburb || "").toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query) || suburb.includes(query);
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Action panel */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 border border-stone-200">
        <div className="flex-1 flex gap-2 max-w-md items-center border border-stone-200 px-3 py-2 bg-stone-50/50">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, suburb..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent outline-none text-[13px] text-stone-800 placeholder-stone-400 font-sans"
          />
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Register Customer
        </button>
      </div>

      {/* Directory Table */}
      <DataTable columns={["Name", "Email", "Phone", "Location", "Activity", "Registered", "Actions"]}>
        {paginatedCustomers.map((c) => (
          <tr key={c.id} className="hover:bg-stone-50/50">
            <td className="px-4 py-3">
              <p className="font-semibold text-stone-800 text-[13px]">{c.name}</p>
              {c.notes && <p className="text-[11px] text-stone-400 truncate max-w-[200px]">{c.notes}</p>}
            </td>
            <td className="px-4 py-3 text-[13px] text-stone-600">{c.email}</td>
            <td className="px-4 py-3 text-[13px] font-mono text-stone-600">{c.phone}</td>
            <td className="px-4 py-3 text-[13px] text-stone-500">
              <p>{c.suburb || "—"}</p>
              <p className="text-[11px] text-stone-400">{c.address}</p>
            </td>
            <td className="px-4 py-3">
              <span className="text-[11px] font-mono text-stone-500">
                {c._count?.bookings || 0} Bookings &middot; {c._count?.invoices || 0} Invoices
              </span>
            </td>
            <td className="px-4 py-3 text-[12px] text-stone-400">
              {new Date(c.createdAt).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(c.id)}
                  className="p-1 hover:text-red-600 text-stone-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {filteredCustomers.length === 0 && (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-stone-400 font-medium">
              No customers registered.
            </td>
          </tr>
        )}
      </DataTable>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-stone-200 px-4 py-3">
          <p className="text-[11px] font-mono text-stone-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} clients
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

      {/* Centered Modal Overlay using Portal */}
      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-stone-900/40 p-4 sm:p-6 sm:items-center overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-white border border-stone-200 w-full max-w-3xl max-h-none sm:max-h-[90vh] flex flex-col shadow-2xl rounded-sm my-auto shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-stone-200 px-6 py-5 bg-white shrink-0">
              <h3 className="text-[15px] font-sans font-bold uppercase tracking-wider text-stone-900">
                {editingCustomer ? "Update Client Details" : "Register New Client Profile"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors p-1.5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Full Name</label>
                      <input type="text" {...register("name")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="E.g. Emily Watson" />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Email Address</label>
                      <input type="email" {...register("email")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="emily@gmail.com" />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Phone Number</label>
                      <input type="text" {...register("phone")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="021-XXXX-XXXX" />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Street Address</label>
                      <input type="text" {...register("address")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="12 Princes Street" />
                      {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
                    </div>
                    
                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Auckland Suburb</label>
                      <input type="text" {...register("suburb")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="Ponsonby" />
                      {errors.suburb && <p className="text-xs text-red-600 mt-1">{errors.suburb.message}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Client Notes / Preferences</label>
                      <textarea
                        {...register("notes")}
                        rows={3}
                        className="w-full border border-[#DDD6CC] bg-white rounded-none p-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans resize-none"
                        placeholder="Gate code, dog details, high-gloss stone floors, regular cleaning times..."
                      />
                    </div>
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
                  {isPending ? "Saving..." : editingCustomer ? "Update" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Customer Profile"
          description="Are you sure you want to permanently delete this customer profile? This will delete all booking logs and invoices related to this customer."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
