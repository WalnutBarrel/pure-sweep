"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/schemas";
import { z } from "zod";
import { useState, useTransition } from "react";
import { submitContactForm } from "@/actions/contact";
import ContactBlock from "@/components/ContactBlock";

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const response = await submitContactForm(data);
      if (response.success) {
        setSuccessMessage(response.message);
        reset();
      } else {
        setErrorMessage(response.message);
      }
    });
  };

  return (
    <div className="container mx-auto py-20 px-6 max-w-6xl animate-enter-fade">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Info Column (ContactBlock) */}
        <div className="lg:col-span-5">
          <ContactBlock />
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-surface border border-border p-8 md:p-10 font-sans">
          <div className="space-y-2 border-b border-border pb-6 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Inquiries</span>
            <h2 className="font-serif text-2xl text-primary font-normal">Send Message</h2>
          </div>

          {successMessage ? (
            <div className="bg-primary/5 border border-primary p-6 space-y-4">
              <h3 className="font-serif text-lg text-primary font-medium">Message Dispatched</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{successMessage}</p>
              <button onClick={() => setSuccessMessage(null)} className="btn-primary py-2.5 px-4 text-[10px]">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-danger/30 text-danger p-4 text-xs font-semibold uppercase">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  {...register("name")} 
                  placeholder="John Doe"
                  className="form-input"
                />
                {errors.name && <p className="text-xs text-danger mt-1 font-semibold">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    {...register("email")} 
                    placeholder="john.doe@example.com"
                    className="form-input"
                  />
                  {errors.email && <p className="text-xs text-danger mt-1 font-semibold">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="form-label">Phone (Optional)</label>
                  <input 
                    type="text" 
                    {...register("phone")} 
                    placeholder="021 123 4567"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Subject (Optional)</label>
                <input 
                  type="text" 
                  {...register("subject")} 
                  placeholder="Commercial Cleaning Quote"
                  className="form-input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Message</label>
                <textarea 
                  rows={5}
                  {...register("message")} 
                  placeholder="Please specify how we can assist you..."
                  className="form-textarea"
                />
                {errors.message && <p className="text-xs text-danger mt-1 font-semibold">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="btn-primary w-full py-4 uppercase tracking-widest text-xs"
              >
                {isPending ? "Sending Message..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
