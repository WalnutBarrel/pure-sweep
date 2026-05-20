/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminPricingPlanSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { createPricingPlan, updatePricingPlan, deletePricingPlan } from "@/actions/crud";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { z } from "zod";

type PricingPlanFormValues = z.infer<typeof adminPricingPlanSchema>;

interface PricingClientProps {
  plans: any[];
  services: any[];
}

export function PricingClient({ plans: initialPlans, services }: PricingClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingPlanFormValues>({
    resolver: zodResolver(adminPricingPlanSchema) as any,
    defaultValues: {
      serviceId: "",
      name: "",
      price: 0,
      description: "",
      features: [],
      isActive: true,
    },
  });

  const openCreate = () => {
    setEditingPlan(null);
    reset({
      serviceId: services[0]?.id || "",
      name: "",
      price: 150,
      description: "",
      features: [],
      isActive: true,
    });
    setIsOpen(true);
  };

  const openEdit = (plan: any) => {
    setEditingPlan(plan);
    reset({
      serviceId: plan.serviceId,
      name: plan.name,
      price: Number(plan.price),
      description: plan.description,
      features: plan.features || [],
      isActive: plan.isActive,
    });
    setIsOpen(true);
  };

  const onSubmit = (data: PricingPlanFormValues) => {
    startTransition(async () => {
      let res;
      if (editingPlan) {
        res = await updatePricingPlan(editingPlan.id, data);
      } else {
        res = await createPricingPlan(data);
      }

      if (res.success) {
        toast(editingPlan ? "Pricing plan updated successfully" : "Pricing plan created successfully");
        setIsOpen(false);
      } else {
        toast(res.message || "An error occurred", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deletePricingPlan(deleteConfirmId);
    if (res.success) {
      toast("Pricing plan deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast(res.message || "Failed to delete pricing plan", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Base rates info table */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">Base Service Rates</h3>
        <DataTable columns={["Service", "Base Price", "Type", "Display Text"]}>
          {services.map((s, i) => (
            <tr key={i} className="hover:bg-stone-50/50">
              <td className="px-4 py-3 text-[13px] font-medium text-stone-800">{s.name}</td>
              <td className="px-4 py-3 font-mono text-[13px] font-medium text-stone-700">{formatPrice(Number(s.basePrice))}</td>
              <td className="px-4 py-3">
                <span className="font-mono text-[11px] uppercase text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5">
                  {s.priceType}
                </span>
              </td>
              <td className="px-4 py-3 text-[13px] text-stone-500">{s.priceDescription}</td>
            </tr>
          ))}
        </DataTable>
      </div>

      {/* Package plans table */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[13px] font-semibold text-stone-500 uppercase tracking-wider">Package Plans</h3>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Package Plan
          </button>
        </div>

        <DataTable columns={["Plan Name", "Service Category", "Price (Ex. GST)", "Description", "Features", "Status", "Actions"]}>
          {initialPlans.map((plan) => (
            <tr key={plan.id} className="hover:bg-stone-50/50">
              <td className="px-4 py-3 text-[13px] font-semibold text-stone-800">{plan.name}</td>
              <td className="px-4 py-3 text-[13px] text-stone-500">{plan.service.name}</td>
              <td className="px-4 py-3 font-mono text-[13px] font-semibold text-stone-700">{formatPrice(Number(plan.price))}</td>
              <td className="px-4 py-3 text-[12px] text-stone-500 max-w-[200px] truncate">{plan.description}</td>
              <td className="px-4 py-3 text-[12px] text-stone-400">
                {plan.features.slice(0, 3).join(", ")}
                {plan.features.length > 3 && ` +${plan.features.length - 3} more`}
              </td>
              <td className="px-4 py-3">
                <span className={`text-[10px] font-semibold uppercase border px-1.5 py-0.5 ${
                  plan.isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-stone-100 text-stone-400 border-stone-200"
                }`}>
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(plan)}
                    className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(plan.id)}
                    className="p-1 hover:text-red-600 text-stone-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      {/* Slide-over Form Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white border-l border-stone-200 w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-enter-fade">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-[15px] font-semibold text-stone-900">
                {editingPlan ? "Modify Package Plan" : "Add New Package Pricing Plan"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="form-label">Linked Base Service</label>
                <select {...register("serviceId")} className="form-select text-[13px]">
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="text-xs text-red-600 mt-1">{errors.serviceId.message}</p>}
              </div>

              <div>
                <label className="form-label">Plan / Package Title</label>
                <input type="text" {...register("name")} className="form-input text-[13px]" placeholder="E.g. 3-Bedroom Flat Rate" />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="form-label">Plan Price ($ Ex. GST)</label>
                <input type="number" step="0.01" {...register("price")} className="form-input text-[13px] font-mono" />
                {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="form-label">Plan Short Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="form-textarea text-[13px]"
                  placeholder="E.g. Fixed rate cleaning for mid-sized homes..."
                />
                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="form-label">Package Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Checklist item 1, Checklist item 2"
                  className="form-input text-[13px]"
                  onChange={(e) => {
                    const features = e.target.value.split(",").map((f) => f.trim()).filter((f) => f.length > 0);
                    reset((prev) => ({
                      ...prev,
                      features,
                    }));
                  }}
                  defaultValue={editingPlan?.features?.join(", ") || ""}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" {...register("isActive")} id="planActive" className="h-4 w-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer" />
                <label htmlFor="planActive" className="text-[12px] font-semibold text-stone-700 cursor-pointer select-none">
                  Package active and visible in catalog pricing
                </label>
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
                  {isPending ? "Saving..." : editingPlan ? "Update" : "Add Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Remove Package Pricing Plan"
          description="Are you absolutely sure you want to delete this flat rate package pricing plan? Any active calculations relying on this flat rate package will default to casual hourly pricing."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
