/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                {editingService ? "Modify Cleaning Service" : "Add New Cleaning Service Category"}
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
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Service Title</label>
                      <input type="text" {...register("name")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="E.g. Residential Cleaning" />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message as string}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">URL Slug</label>
                      <input type="text" {...register("slug")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="residential-cleaning" />
                      {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message as string}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Full Service Description</label>
                      <textarea
                        {...register("description")}
                        rows={6}
                        className="w-full border border-[#DDD6CC] bg-white rounded-none p-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans resize-none"
                        placeholder="Describe standard exclusions, inclusions, and checklists..."
                      />
                      {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message as string}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Service Category</label>
                      <input type="text" {...register("category")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="Residential" />
                      {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message as string}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Pricing structure</label>
                      <select {...register("priceType")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors">
                        <option value="HOURLY">Hourly Rate</option>
                        <option value="FIXED">Flat Rate</option>
                        <option value="RANGE">Price Range</option>
                      </select>
                      {errors.priceType && <p className="text-xs text-red-600 mt-1">{errors.priceType.message as string}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Base Rate ($)</label>
                        <input type="number" step="0.01" {...register("basePrice", { valueAsNumber: true })} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" />
                        {errors.basePrice && <p className="text-xs text-red-600 mt-1">{errors.basePrice.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-stone-500 mb-1.5 block">Display Label</label>
                        <input type="text" {...register("priceDescription")} className="w-full h-11 border border-[#DDD6CC] bg-white rounded-none px-3 text-[13px] outline-none focus:border-[#0F3D3E] font-sans transition-colors" placeholder="$40 + GST / hour" />
                        {errors.priceDescription && <p className="text-xs text-red-600 mt-1">{errors.priceDescription.message as string}</p>}
                      </div>
                    </div>

                    <div className="bg-[#FAF9F6] border border-[#DDD6CC] p-4 mt-2">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" {...register("isActive")} id="isActive" className="h-4 w-4 rounded-sm border-stone-300 text-stone-900 focus:ring-0 cursor-pointer" />
                        <label htmlFor="isActive" className="text-[12px] font-semibold text-stone-700 cursor-pointer select-none">
                          Service active and bookable online
                        </label>
                      </div>
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
                  {isPending ? "Saving..." : editingService ? "Update" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

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
