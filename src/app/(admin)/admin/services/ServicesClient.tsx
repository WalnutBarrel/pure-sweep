/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminServiceSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createService, updateService, deleteService } from "@/actions/crud";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { z } from "zod";

type ServiceFormValues = z.infer<typeof adminServiceSchema>;

interface ServicesClientProps {
  services: any[];
}

export function ServicesClient({ services: initialServices }: ServicesClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(adminServiceSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      basePrice: 0,
      priceType: "HOURLY",
      priceDescription: "",
      category: "Residential",
      features: [],
      isActive: true,
    },
  });

  const openCreate = () => {
    setEditingService(null);
    reset({
      name: "",
      slug: "",
      description: "",
      basePrice: 40,
      priceType: "HOURLY",
      priceDescription: "$40 + GST / hour",
      category: "Residential",
      features: [],
      isActive: true,
    });
    setIsOpen(true);
  };

  const openEdit = (service: any) => {
    setEditingService(service);
    reset({
      name: service.name,
      slug: service.slug,
      description: service.description,
      basePrice: Number(service.basePrice),
      priceType: service.priceType as "HOURLY" | "FIXED" | "RANGE",
      priceDescription: service.priceDescription,
      category: service.category,
      features: service.features || [],
      isActive: service.isActive,
    });
    setIsOpen(true);
  };

  const onSubmit = (data: ServiceFormValues) => {
    startTransition(async () => {
      let res;
      if (editingService) {
        res = await updateService(editingService.id, data);
      } else {
        res = await createService(data);
      }

      if (res.success) {
        toast(editingService ? "Service updated successfully" : "Service created successfully");
        setIsOpen(false);
      } else {
        toast(res.message || "An error occurred", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteService(deleteConfirmId);
    if (res.success) {
      toast("Service deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast(res.message || "Failed to delete service", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action panel */}
      <div className="flex justify-end bg-white p-4 border border-stone-200">
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Service Type
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialServices.map((service) => (
          <div key={service.id} className="bg-white border border-stone-200 p-5 space-y-4 hover:border-stone-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                    {service.category}
                  </span>
                  <h3 className="text-[15px] font-serif font-normal text-stone-900 mt-0.5">{service.name}</h3>
                </div>
                <span className={`shrink-0 text-[10px] font-semibold uppercase border px-1.5 py-0.5 ${
                  service.isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-stone-100 text-stone-400 border-stone-200"
                }`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-[12px] text-stone-500 leading-relaxed min-h-[36px] line-clamp-2">
                {service.description}
              </p>

              <div className="border-t border-stone-100 pt-3 space-y-2">
                <div className="flex justify-between text-[12px]">
                  <span className="text-stone-400">Base Price</span>
                  <span className="font-mono font-medium text-stone-700">{formatPrice(Number(service.basePrice))}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-stone-400">Pricing Type</span>
                  <span className="font-mono text-stone-500">{service.priceType}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-stone-400">Rates Displayed</span>
                  <span className="text-stone-500 text-[11px] font-medium">{service.priceDescription}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-3 flex justify-between gap-2 shrink-0">
              <button
                onClick={() => openEdit(service)}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 border border-stone-200 px-3 py-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirmId(service.id)}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 border border-red-100 px-3 py-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Form Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white border-l border-stone-200 w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-enter-fade">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-[15px] font-semibold text-stone-900">
                {editingService ? "Modify Cleaning Service" : "Add New Cleaning Service Category"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="form-label">Service Title</label>
                <input type="text" {...register("name")} className="form-input text-[13px]" placeholder="E.g. Residential Cleaning" />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="form-label">URL Slug</label>
                <input type="text" {...register("slug")} className="form-input text-[13px]" placeholder="residential-cleaning" />
                {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Service Category</label>
                  <input type="text" {...register("category")} className="form-input text-[13px]" placeholder="Residential" />
                  {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="form-label">Pricing structure</label>
                  <select {...register("priceType")} className="form-select text-[13px]">
                    <option value="HOURLY">Hourly Rate</option>
                    <option value="FIXED">Flat Rate</option>
                    <option value="RANGE">Price Range</option>
                  </select>
                  {errors.priceType && <p className="text-xs text-red-600 mt-1">{errors.priceType.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Base Rate ($)</label>
                  <input type="number" step="0.01" {...register("basePrice")} className="form-input text-[13px]" />
                  {errors.basePrice && <p className="text-xs text-red-600 mt-1">{errors.basePrice.message}</p>}
                </div>
                <div>
                  <label className="form-label">Pricing Display Label</label>
                  <input type="text" {...register("priceDescription")} className="form-input text-[13px]" placeholder="$40 + GST / hour" />
                  {errors.priceDescription && <p className="text-xs text-red-600 mt-1">{errors.priceDescription.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Full Service Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="form-textarea text-[13px]"
                  placeholder="Describe standard exclusions, inclusions, and checklists..."
                />
                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" {...register("isActive")} id="isActive" className="h-4 w-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer" />
                <label htmlFor="isActive" className="text-[12px] font-semibold text-stone-700 cursor-pointer select-none">
                  Service active and bookable online
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
                  {isPending ? "Saving..." : editingService ? "Update" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Remove Service Category"
          description="Are you absolutely sure you want to remove this service category? All recurring pricing structures and plans matching this category will be detached."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
