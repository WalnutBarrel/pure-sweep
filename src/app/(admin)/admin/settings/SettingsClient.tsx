/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminStaffSchema, adminTestimonialSchema } from "@/schemas";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import {
  updateSetting,
  createStaff,
  updateStaff,
  deleteStaff,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/actions/crud";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, X, Settings2, Users2, Quote, ScrollText } from "lucide-react";
import { z } from "zod";

type StaffFormValues = z.infer<typeof adminStaffSchema>;
type TestimonialFormValues = z.infer<typeof adminTestimonialSchema>;

interface SettingsClientProps {
  settings: any[];
  staff: any[];
  testimonials: any[];
  activityLogs: any[];
}

export function SettingsClient({ settings, staff: initialStaff, testimonials: initialTestimonials, activityLogs }: SettingsClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"config" | "staff" | "testimonials" | "logs">("config");

  // Edit / Creation states
  const [configEditing, setConfigEditing] = useState<any>(null);
  const [configValue, setConfigValue] = useState("");
  const [configDesc, setConfigDesc] = useState("");

  const [staffOpen, setStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [staffConfirmDelete, setStaffConfirmDelete] = useState<string | null>(null);

  const [testimonialOpen, setTestimonialOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialConfirmDelete, setTestimonialConfirmDelete] = useState<string | null>(null);

  // Forms resolver
  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(adminStaffSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      hourlyRate: 30,
      isActive: true,
      email: "",
    },
  });

  const testimonialForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(adminTestimonialSchema) as any,
    defaultValues: {
      quote: "",
      author: "",
      role: "Home Owner",
      location: "Auckland",
      rating: 5,
      isApproved: true,
    },
  });

  // Config Update Action
  const handleConfigSave = async () => {
    if (!configEditing) return;
    const res = await updateSetting(configEditing.key, configValue, configDesc);
    if (res.success) {
      toast("Configuration updated successfully");
      setConfigEditing(null);
    } else {
      toast(res.message || "Failed to update configuration", "error");
    }
  };

  // Staff Actions
  const onStaffSubmit = (data: StaffFormValues) => {
    startTransition(async () => {
      let res;
      if (editingStaff) {
        res = await updateStaff(editingStaff.id, data);
      } else {
        res = await createStaff(data);
      }

      if (res.success) {
        toast(editingStaff ? "Staff updated successfully" : "Staff hired successfully");
        setStaffOpen(false);
      } else {
        toast(res.message || "Failed to save staff record", "error");
      }
    });
  };

  const handleStaffDelete = async () => {
    if (!staffConfirmDelete) return;
    const res = await deleteStaff(staffConfirmDelete);
    if (res.success) {
      toast("Staff listing terminated successfully");
      setStaffConfirmDelete(null);
    } else {
      toast(res.message || "Failed to delete staff", "error");
    }
  };

  // Testimonial Actions
  const onTestimonialSubmit = (data: TestimonialFormValues) => {
    startTransition(async () => {
      let res;
      if (editingTestimonial) {
        res = await updateTestimonial(editingTestimonial.id, data);
      } else {
        res = await createTestimonial(data);
      }

      if (res.success) {
        toast(editingTestimonial ? "Testimonial updated successfully" : "Testimonial added successfully");
        setTestimonialOpen(false);
      } else {
        toast(res.message || "Failed to save testimonial", "error");
      }
    });
  };

  const handleTestimonialDelete = async () => {
    if (!testimonialConfirmDelete) return;
    const res = await deleteTestimonial(testimonialConfirmDelete);
    if (res.success) {
      toast("Testimonial deleted successfully");
      setTestimonialConfirmDelete(null);
    } else {
      toast(res.message || "Failed to delete testimonial", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs strip */}
      <div className="flex border-b border-stone-200 bg-white p-1 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab("config")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "config"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Settings2 className="h-4 w-4" />
          Configuration
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "staff"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Users2 className="h-4 w-4" />
          Staff roster
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "testimonials"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Quote className="h-4 w-4" />
          Testimonials
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeTab === "logs"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <ScrollText className="h-4 w-4" />
          Activity Log
        </button>
      </div>

      {/* 1. CONFIG TAB */}
      {activeTab === "config" && (
        <div className="space-y-4">
          <DataTable columns={["Setting Key", "Value", "Description", "Actions"]}>
            {settings.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 font-mono text-[13px] font-semibold text-stone-700">{s.key}</td>
                <td className="px-4 py-3 font-mono text-[13px] text-stone-900">
                  {configEditing?.key === s.key ? (
                    <input
                      type="text"
                      value={configValue}
                      onChange={(e) => setConfigValue(e.target.value)}
                      className="border border-stone-200 px-2 py-1 text-[13px] font-mono outline-none w-full"
                    />
                  ) : (
                    s.value
                  )}
                </td>
                <td className="px-4 py-3 text-[12px] text-stone-400">
                  {configEditing?.key === s.key ? (
                    <input
                      type="text"
                      value={configDesc}
                      onChange={(e) => setConfigDesc(e.target.value)}
                      className="border border-stone-200 px-2 py-1 text-[12px] outline-none w-full"
                    />
                  ) : (
                    s.description || "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {configEditing?.key === s.key ? (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleConfigSave}
                        className="px-3 py-1.5 bg-stone-900 text-white text-[11px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setConfigEditing(null)}
                        className="px-3 py-1.5 border border-stone-200 text-stone-700 text-[11px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setConfigEditing(s);
                        setConfigValue(s.value);
                        setConfigDesc(s.description || "");
                      }}
                      className="p-1 hover:text-stone-950 text-stone-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      )}

      {/* 2. STAFF TAB */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex justify-end bg-white p-4 border border-stone-200">
            <button
              onClick={() => {
                setEditingStaff(null);
                staffForm.reset({
                  firstName: "",
                  lastName: "",
                  phone: "",
                  hourlyRate: 35,
                  isActive: true,
                  email: "",
                });
                setStaffOpen(true);
              }}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Staff Listing
            </button>
          </div>

          <DataTable columns={["Staff Member", "Contact Coordinates", "Compensation Base", "Status", "Actions"]}>
            {initialStaff.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-stone-800 text-[13px]">{s.firstName} {s.lastName}</p>
                  <p className="text-[11px] text-stone-400 font-mono">UID: {s.userId}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-stone-600">
                  <p>{s.phone}</p>
                  <p className="text-[11px] text-stone-400">{s.user?.email || "No email linked"}</p>
                </td>
                <td className="px-4 py-3 font-mono text-[13px] font-medium text-stone-700">
                  {formatPrice(Number(s.hourlyRate))}/hr
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold uppercase border px-1.5 py-0.5 ${
                    s.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-stone-100 text-stone-400 border-stone-200"
                  }`}>
                    {s.isActive ? "Active Cleaner" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingStaff(s);
                        staffForm.reset({
                          firstName: s.firstName,
                          lastName: s.lastName,
                          phone: s.phone,
                          hourlyRate: Number(s.hourlyRate),
                          isActive: s.isActive,
                          email: s.user?.email || "",
                        });
                        setStaffOpen(true);
                      }}
                      className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setStaffConfirmDelete(s.id)}
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
      )}

      {/* 3. TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <div className="flex justify-end bg-white p-4 border border-stone-200">
            <button
              onClick={() => {
                setEditingTestimonial(null);
                testimonialForm.reset({
                  quote: "",
                  author: "",
                  role: "Home Owner",
                  location: "Auckland",
                  rating: 5,
                  isApproved: true,
                });
                setTestimonialOpen(true);
              }}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-semibold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Testimonial
            </button>
          </div>

          <DataTable columns={["Author", "Location", "Review Quote", "Approved", "Actions"]}>
            {initialTestimonials.map((t) => (
              <tr key={t.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-stone-800 text-[13px]">{t.author}</p>
                  <p className="text-[11px] text-stone-400">{t.role}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-stone-600">{t.location || "Auckland"}</td>
                <td className="px-4 py-3 text-[12px] text-stone-500 max-w-[280px] truncate leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold uppercase border px-1.5 py-0.5 ${
                    t.isApproved
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}>
                    {t.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTestimonial(t);
                        testimonialForm.reset({
                          quote: t.quote,
                          author: t.author,
                          role: t.role || "",
                          location: t.location || "",
                          rating: t.rating || 5,
                          isApproved: t.isApproved,
                        });
                        setTestimonialOpen(true);
                      }}
                      className="p-1 hover:text-stone-900 text-stone-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setTestimonialConfirmDelete(t.id)}
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
      )}

      {/* 4. ACTIVITY LOG TAB */}
      {activeTab === "logs" && (
        <DataTable columns={["Action Tag", "Staff / Admin Profile", "Incident Log", "Client IP Address", "Timestamp"]}>
          {activityLogs.map((log) => (
            <tr key={log.id} className="hover:bg-stone-50/50">
              <td className="px-4 py-3">
                <span className="font-mono text-[11px] font-semibold text-stone-700 bg-stone-100 border border-stone-200 px-1.5 py-0.5">
                  {log.action}
                </span>
              </td>
              <td className="px-4 py-3 text-[13px] text-stone-600">{log.user?.name || log.user?.email || "System Daemon"}</td>
              <td className="px-4 py-3 text-[12px] text-stone-500 max-w-[300px] truncate">{log.details}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-stone-400">{log.ipAddress || "—"}</td>
              <td className="px-4 py-3 text-[12px] text-stone-400">
                {new Date(log.createdAt).toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" })}
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {/* Slide-over Staff Form */}
      {staffOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setStaffOpen(false)} />
          <div className="relative bg-white border-l border-stone-200 w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-enter-fade">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-[15px] font-semibold text-stone-900">
                {editingStaff ? "Modify Staff coordinates" : "Hire Staff / Cleaner"}
              </h3>
              <button onClick={() => setStaffOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={staffForm.handleSubmit(onStaffSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First Name</label>
                  <input type="text" {...staffForm.register("firstName")} className="form-input text-[13px]" placeholder="Liam" />
                  {staffForm.formState.errors.firstName && <p className="text-xs text-red-600 mt-1">{staffForm.formState.errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input type="text" {...staffForm.register("lastName")} className="form-input text-[13px]" placeholder="Cooper" />
                  {staffForm.formState.errors.lastName && <p className="text-xs text-red-600 mt-1">{staffForm.formState.errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Email Address (Optional)</label>
                <input type="email" {...staffForm.register("email")} className="form-input text-[13px]" placeholder="liam@puresweep.co.nz" />
                {staffForm.formState.errors.email && <p className="text-xs text-red-600 mt-1">{staffForm.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label">Mobile Contact</label>
                <input type="text" {...staffForm.register("phone")} className="form-input text-[13px]" placeholder="022-XXXX-XXXX" />
                {staffForm.formState.errors.phone && <p className="text-xs text-red-600 mt-1">{staffForm.formState.errors.phone.message}</p>}
              </div>

              <div>
                <label className="form-label">Hourly Compensation Rate ($)</label>
                <input type="number" {...staffForm.register("hourlyRate")} className="form-input text-[13px] font-mono" />
                {staffForm.formState.errors.hourlyRate && <p className="text-xs text-red-600 mt-1">{staffForm.formState.errors.hourlyRate.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" {...staffForm.register("isActive")} id="staffActive" className="h-4 w-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer" />
                <label htmlFor="staffActive" className="text-[12px] font-semibold text-stone-700 cursor-pointer select-none">
                  Staff listing active and schedulable
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStaffOpen(false)}
                  className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-700 text-[12px] font-bold py-3 uppercase tracking-widest cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-bold py-3 uppercase tracking-widest cursor-pointer text-center disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingStaff ? "Update" : "Hire Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-over Testimonial Form */}
      {testimonialOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTestimonialOpen(false)} />
          <div className="relative bg-white border-l border-stone-200 w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-enter-fade">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h3 className="text-[15px] font-semibold text-stone-900">
                {editingTestimonial ? "Modify Review Statement" : "Add Customer Testimonial"}
              </h3>
              <button onClick={() => setTestimonialOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="form-label">Reviewer / Author Name</label>
                <input type="text" {...testimonialForm.register("author")} className="form-input text-[13px]" placeholder="E.g. David Brown" />
                {testimonialForm.formState.errors.author && <p className="text-xs text-red-600 mt-1">{testimonialForm.formState.errors.author.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Role / Occupation</label>
                  <input type="text" {...testimonialForm.register("role")} className="form-input text-[13px]" placeholder="Home Owner" />
                </div>
                <div>
                  <label className="form-label">Location Suburb</label>
                  <input type="text" {...testimonialForm.register("location")} className="form-input text-[13px]" placeholder="Remuera" />
                </div>
              </div>

              <div>
                <label className="form-label">Rating Score (1-5)</label>
                <select {...testimonialForm.register("rating")} className="form-select text-[13px]">
                  <option value={5}>5 Stars Exceptional</option>
                  <option value={4}>4 Stars Very Good</option>
                  <option value={3}>3 Stars Satisfactory</option>
                </select>
              </div>

              <div>
                <label className="form-label">Review Quote / Statement</label>
                <textarea
                  {...testimonialForm.register("quote")}
                  rows={4}
                  className="form-textarea text-[13px]"
                  placeholder="PureSweep cleaners are polite, details-oriented, and highly trustworthy..."
                />
                {testimonialForm.formState.errors.quote && <p className="text-xs text-red-600 mt-1">{testimonialForm.formState.errors.quote.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" {...testimonialForm.register("isApproved")} id="isApproved" className="h-4 w-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer" />
                <label htmlFor="isApproved" className="text-[12px] font-semibold text-stone-700 cursor-pointer select-none">
                  Review approved and displayed on homepage
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTestimonialOpen(false)}
                  className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-700 text-[12px] font-bold py-3 uppercase tracking-widest cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-[12px] font-bold py-3 uppercase tracking-widest cursor-pointer text-center disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingTestimonial ? "Update" : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Safeguards */}
      {staffConfirmDelete && (
        <ConfirmDialog
          title="Terminate Staff Coordinate"
          description="Are you absolutely sure you want to delete this staff listing? Detaching the staff profile will remove them from pending cleans."
          onConfirm={handleStaffDelete}
          onCancel={() => setStaffConfirmDelete(null)}
          destructive
        />
      )}

      {testimonialConfirmDelete && (
        <ConfirmDialog
          title="Delete Customer Testimonial"
          description="Are you sure you want to permanently delete this testimonial review from website listings?"
          onConfirm={handleTestimonialDelete}
          onCancel={() => setTestimonialConfirmDelete(null)}
          destructive
        />
      )}
    </div>
  );
}
