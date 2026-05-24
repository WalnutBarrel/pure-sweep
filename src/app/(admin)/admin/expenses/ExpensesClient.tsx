/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminExpenseSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { createExpense, updateExpense, deleteExpense } from "@/actions/crud";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { z } from "zod";

type ExpenseFormValues = z.infer<typeof adminExpenseSchema>;

interface ExpensesClientProps {
  expenses: any[];
}

export function ExpensesClient({ expenses: initialExpenses }: ExpensesClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(adminExpenseSchema) as any,
    defaultValues: {
      description: "",
      category: "SUPPLIES",
      amount: 0,
      gstAmount: 0,
      date: "",
      recipient: "",
      notes: "",
    },
  });

  const openCreate = () => {
    setEditingExpense(null);
    reset({
      description: "",
      category: "SUPPLIES",
      amount: 0,
      gstAmount: 0,
      date: new Date().toISOString().split("T")[0],
      recipient: "",
      notes: "",
    });
    setIsOpen(true);
  };

  const openEdit = (expense: any) => {
    setEditingExpense(expense);
    reset({
      description: expense.description,
      category: expense.category,
      amount: Number(expense.amount),
      gstAmount: Number(expense.gstAmount),
      date: new Date(expense.date).toISOString().split("T")[0],
      recipient: expense.recipient,
      notes: expense.notes || "",
    });
    setIsOpen(true);
  };

  const onSubmit = (data: ExpenseFormValues) => {
    startTransition(async () => {
      let res;
      if (editingExpense) {
        res = await updateExpense(editingExpense.id, data);
      } else {
        res = await createExpense(data);
      }

      if (res.success) {
        toast(editingExpense ? "Expense updated successfully" : "Expense logged successfully");
        setIsOpen(false);
      } else {
        toast(res.message || "An error occurred", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteExpense(deleteConfirmId);
    if (res.success) {
      toast("Expense deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast(res.message || "Failed to delete expense", "error");
    }
  };

  const filteredExpenses = initialExpenses.filter((exp) => {
    const desc = exp.description.toLowerCase();
    const recip = exp.recipient.toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = desc.includes(query) || recip.includes(query);
    const matchesCategory = categoryFilter === "ALL" || exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Action and search strip */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-4 border border-stone-200">
        <div className="flex-1 flex gap-2 max-w-md items-center border border-stone-200 px-3 py-2 bg-stone-50/50">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by description or recipient..."
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
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-stone-200 px-3 py-2 text-[12px] bg-white outline-none cursor-pointer text-stone-700 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="SUPPLIES">Supplies</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="TRAVEL">Travel / Fuel</option>
            <option value="SALARY">Salary</option>
            <option value="MARKETING">Marketing</option>
            <option value="OTHER">Other</option>
          </select>

          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Expense
          </button>
        </div>
      </div>

      {/* Main Expenses Table */}
      <DataTable columns={["Description", "Category", "Recipient / Vendor", "Amount (Ex. GST)", "GST", "Total", "Date", "Actions"]}>
        {paginatedExpenses.map((exp) => (
          <tr key={exp.id} className="hover:bg-stone-50/50">
            <td className="px-4 py-3">
              <p className="font-semibold text-stone-800 text-[13px]">{exp.description}</p>
              {exp.notes && <p className="text-[11px] text-stone-400 truncate max-w-[200px]">{exp.notes}</p>}
            </td>
            <td className="px-4 py-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5">
                {exp.category}
              </span>
            </td>
            <td className="px-4 py-3 text-[13px] text-stone-600">{exp.recipient}</td>
            <td className="px-4 py-3 font-mono text-[13px]">{formatPrice(Number(exp.amount))}</td>
            <td className="px-4 py-3 font-mono text-[13px] text-stone-400">{formatPrice(Number(exp.gstAmount))}</td>
            <td className="px-4 py-3 font-mono text-[13px] font-semibold text-stone-800">
              {formatPrice(Number(exp.amount) + Number(exp.gstAmount))}
            </td>
            <td className="px-4 py-3 text-[12px] text-stone-500 font-medium">
              {new Date(exp.date).toLocaleDateString("en-NZ", { dateStyle: "medium" })}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(exp)}
                  className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(exp.id)}
                  className="p-1 hover:text-red-600 text-stone-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {filteredExpenses.length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-stone-400 font-medium">
              No logged expense records.
            </td>
          </tr>
        )}
      </DataTable>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-stone-200 px-4 py-3">
          <p className="text-[11px] font-mono text-stone-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} entries
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
            className="relative bg-white border border-stone-200 w-full max-w-4xl max-h-none sm:max-h-[90vh] flex flex-col shadow-2xl rounded-sm my-auto shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-stone-200 px-6 py-5 bg-white shrink-0">
              <h3 className="text-[15px] font-sans font-bold uppercase tracking-wider text-stone-900">
                {editingExpense ? "Modify Logged Expense" : "Log Business Expense Record"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors p-1.5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Expense description / item</label>
                      <input type="text" {...register("description")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="E.g. Dyson V15 Vacuum replacement filters" />
                      {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message as string}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Category</label>
                        <select {...register("category")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors">
                          <option value="SUPPLIES">Supplies (Solvents/Wipes)</option>
                          <option value="EQUIPMENT">Equipment (Hardware)</option>
                          <option value="TRAVEL">Travel / Van Fuel</option>
                          <option value="SALARY">Salary / Wages</option>
                          <option value="MARKETING">Marketing & SEO Ads</option>
                          <option value="OTHER">Other</option>
                        </select>
                        {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Date Incurred</label>
                        <input type="date" {...register("date")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" />
                        {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message as string}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Recipient / Vendor</label>
                      <input type="text" {...register("recipient")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="E.g. Bunnings Warehouse" />
                      {errors.recipient && <p className="text-xs text-red-600 mt-1">{errors.recipient.message as string}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Amount (Ex. GST)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register("amount")}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            // Auto calculate standard 15% GST
                            const gst = Math.round(val * 0.15 * 100) / 100;
                            reset((prev) => ({
                              ...prev,
                              amount: val,
                              gstAmount: gst,
                            }));
                          }}
                          className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-mono transition-colors"
                        />
                        {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">GST Paid (15%)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register("gstAmount")}
                          className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-mono transition-colors"
                        />
                        {errors.gstAmount && <p className="text-xs text-red-600 mt-1">{errors.gstAmount.message as string}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Expense Notes</label>
                      <textarea
                        {...register("notes")}
                        rows={5}
                        className="w-full border border-[#DDD6CC] bg-white rounded-none p-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans resize-none"
                        placeholder="Additional context about this expenditure..."
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
                  {isPending ? "Saving..." : editingExpense ? "Update" : "Log Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Expense Record"
          description="Are you absolutely sure you want to delete this recorded business expense? This will permanently modify your profit and loss and GST collected statement values."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
