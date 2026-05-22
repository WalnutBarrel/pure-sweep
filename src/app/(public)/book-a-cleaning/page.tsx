"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { bookingSchema } from "@/schemas";
import { z } from "zod";
import { createBooking } from "@/actions/booking";
import { calculateTotalPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

type BookingFormValues = z.infer<typeof bookingSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
  }),
};

const serviceMap: Record<string, string> = {
  "residential-cleaning": "Bespoke Residential Cleaning",
  "deep-cleaning": "Specialized Deep Cleaning",
  "move-in-move-out-cleaning": "Move-in / Move-out Cleaning",
  "commercial-cleaning": "Premium Commercial Cleaning",
  "carpet-cleaning": "Carpet Steam Cleaning",
  "post-construction-cleaning": "Post-Construction Cleaning",
};

function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    clientName: string;
    serviceId: string;
    preferredDate: string;
    contactPhone?: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "residential-cleaning";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any, // eslint-disable-line
    defaultValues: {
      serviceId: serviceParam,
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      address: "",
      suburb: "",
      preferredDate: "",
      preferredTime: "",
      propertyType: "House",
      cleaningFrequency: "One-off",
      bedrooms: 2,
      bathrooms: 1,
      extraServices: [],
      notes: "",
    },
  });

  useEffect(() => {
    if (serviceParam) {
      setValue("serviceId", serviceParam);
    }
  }, [serviceParam, setValue]);

  // Watch variables for live estimate
  const selectedServiceId = watch("serviceId");
  const bedroomsCount = watch("bedrooms") || 2;
  const bathroomsCount = watch("bathrooms") || 1;
  const selectedExtraServices = watch("extraServices") || [];

  const priceDetails = calculateTotalPrice(
    selectedServiceId || "residential-cleaning",
    bedroomsCount,
    bathroomsCount,
    selectedExtraServices
  );

  const onSubmit = (data: BookingFormValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      const response = await createBooking(data);
      if (response.success) {
        setBookingRef(response.bookingRef || null);
        setSubmittedData({
          clientName: data.clientName,
          serviceId: data.serviceId,
          preferredDate: data.preferredDate,
          contactPhone: response.contactPhone,
        });
        setSubmitted(true);
        reset();
      } else {
        setErrorMessage(response.message);
      }
    });
  };

  // WhatsApp generation
  const whatsappUrl = (() => {
    if (!submittedData || !bookingRef) return "";
    
    // Use the dynamic contact phone returned from the server, strip non-numeric characters
    const rawPhone = submittedData.contactPhone || "642102699956";
    let cleanPhone = rawPhone.replace(/\D/g, "");
    
    // Ensure it starts with NZ country code if it doesn't already
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "64" + cleanPhone.substring(1);
    }

    const dateFormatted = new Date(submittedData.preferredDate).toLocaleDateString("en-NZ", { dateStyle: "medium" });
    const serviceName = serviceMap[submittedData.serviceId] || "Signature Cleaning Service";
    
    const text = `Hi PureSweep, I've just submitted a booking request online.

• Name: ${submittedData.clientName}
• Service: ${serviceName}
• Date: ${dateFormatted}
• Reference: ${bookingRef}

I'd like to confirm the schedule details. Thank you!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  })();

  // -------------------------------------------------------------------
  // Success Confirmation
  // -------------------------------------------------------------------
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-2xl mx-auto mt-16 space-y-8"
      >
        <div className="border border-border bg-surface p-10 md:p-14 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
            <h2 className="font-serif text-[26px] md:text-[30px] font-light text-primary">
              Booking Request Received
            </h2>
          </div>

          {bookingRef && (
            <div className="bg-background border border-border px-5 py-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-text font-semibold">Reference Number</p>
              <p className="font-mono text-lg text-primary font-medium mt-1">{bookingRef}</p>
            </div>
          )}

          <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
            <p>
              Your cleaning request has been saved and is now pending review. An Auckland-based administrator will confirm your preferred schedule within one business day.
            </p>
            <p>
              A confirmation notice will be sent to the email address you provided. Please keep your reference number for any future correspondence.
            </p>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-3">

            <button
              onClick={() => {
                setSubmitted(false);
                setBookingRef(null);
                setSubmittedData(null);
              }}
              className="btn-primary"
            >
              Submit Another Request
            </button>
            <Link href="/" className="btn-outline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // -------------------------------------------------------------------
  // Booking Form
  // -------------------------------------------------------------------
  const showRoomConfig =
    selectedServiceId === "residential-cleaning" ||
    selectedServiceId === "deep-cleaning" ||
    selectedServiceId === "move-in-move-out-cleaning" ||
    selectedServiceId === "post-construction-cleaning";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-14 items-start mt-12">
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-12">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-danger/30 text-danger p-4 text-xs font-semibold uppercase tracking-wider"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 1: Service */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="space-y-6"
        >
          <h2 className="font-serif text-[24px] md:text-[26px] text-primary border-b border-border pb-4 font-light">
            Service Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="form-label">Service Type</label>
              <select {...register("serviceId")} className="form-select">
                <option value="residential-cleaning">Residential Cleaning -- $40 + GST / hr</option>
                <option value="deep-cleaning">Deep Cleaning -- From $320 + GST</option>
                <option value="move-in-move-out-cleaning">Move-in / Move-out Cleaning -- From $320 + GST</option>
                <option value="commercial-cleaning">Commercial Cleaning -- $45 + GST / hr</option>
                <option value="carpet-cleaning">Carpet Cleaning -- $250 + GST</option>
                <option value="post-construction-cleaning">Post-Construction Cleaning -- From $400 + GST</option>
              </select>
              {errors.serviceId && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.serviceId.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="form-label">Property Type</label>
              <select {...register("propertyType")} className="form-select">
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail / Commercial</option>
                <option value="Other">Other</option>
              </select>
              {errors.propertyType && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.propertyType.message}</p>}
            </div>
          </div>

          {showRoomConfig && (
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  {...register("bedrooms", { valueAsNumber: true })}
                  className="form-input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  {...register("bathrooms", { valueAsNumber: true })}
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="form-label">Cleaning Frequency</label>
            <select {...register("cleaningFrequency")} className="form-select">
              <option value="One-off">One-off Clean</option>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
              <option value="Monthly">Monthly</option>
            </select>
            {errors.cleaningFrequency && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.cleaningFrequency.message}</p>}
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <label className="form-label">Optional Add-Ons</label>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-stone-700 select-none">
                <input
                  type="checkbox"
                  value="Oven Cleaning"
                  {...register("extraServices")}
                  className="rounded-none border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Oven Interior Deep Clean (+$67 + GST)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-stone-700 select-none">
                <input
                  type="checkbox"
                  value="Carpet Cleaning"
                  {...register("extraServices")}
                  className="rounded-none border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Carpet Steam Cleaning (+$250 + GST)</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Contact */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="space-y-6"
        >
          <h2 className="font-serif text-[24px] md:text-[26px] text-primary border-b border-border pb-4 font-light">
            Contact Information
          </h2>

          <div className="flex flex-col gap-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              {...register("clientName")}
              placeholder="Jane Smith"
              className="form-input"
            />
            {errors.clientName && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.clientName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                {...register("clientEmail")}
                placeholder="jane.smith@gmail.com"
                className="form-input"
              />
              {errors.clientEmail && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.clientEmail.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                {...register("clientPhone")}
                placeholder="021 026 999 56"
                className="form-input"
              />
              {errors.clientPhone && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.clientPhone.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* Section 3: Location & Schedule */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="space-y-6"
        >
          <h2 className="font-serif text-[24px] md:text-[26px] text-primary border-b border-border pb-4 font-light">
            Property Location and Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                {...register("address")}
                placeholder="105 Hillsborough Road"
                className="form-input"
              />
              {errors.address && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.address.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="form-label">Auckland Suburb</label>
              <input
                type="text"
                {...register("suburb")}
                placeholder="Hillsborough"
                className="form-input"
              />
              {errors.suburb && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.suburb.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                {...register("preferredDate")}
                min={new Date().toISOString().split("T")[0]}
                className="form-input"
              />
              {errors.preferredDate && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.preferredDate.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="form-label">Preferred Time</label>
              <select {...register("preferredTime")} className="form-select">
                <option value="">-- Choose a Slot --</option>
                <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                <option value="Evening (16:00 - 19:00)">Evening (16:00 - 19:00)</option>
              </select>
              {errors.preferredTime && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.preferredTime.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea
              rows={4}
              {...register("notes")}
              placeholder="Access codes, parking details, areas requiring special attention, or anything else you would like us to know."
              className="form-textarea"
            />
            {errors.notes && <p className="text-xs text-danger mt-0.5 font-semibold">{errors.notes.message}</p>}
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Request
              </>
            ) : (
              <>
                Confirm Reservation Request
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
          <p className="text-[11px] text-muted-text mt-3 leading-relaxed text-center">
            By submitting, you agree to PureSweep&apos;s service terms. No payment is required at this stage.
          </p>
        </motion.div>
      </form>

      {/* Pricing Side Panel */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="lg:col-span-1 bg-surface border border-border p-8 sticky top-24 space-y-6"
      >
        <div>
          <span className="font-caption">Estimate</span>
          <h3 className="font-serif text-xl font-normal text-stone-900 mt-1">Pricing Overview</h3>
        </div>

        <div className="border-t border-border pt-4 space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500 font-medium">Service</span>
            <span className="text-stone-800 font-semibold text-right capitalize">
              {selectedServiceId?.replace(/-/g, " ")}
            </span>
          </div>

          {showRoomConfig && (
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Rooms</span>
              <span className="text-stone-800 font-semibold">
                {bedroomsCount} Bed / {bathroomsCount} Bath
              </span>
            </div>
          )}

          {selectedExtraServices.length > 0 && (
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Add-Ons</span>
              <span className="text-stone-800 font-semibold text-right">
                {selectedExtraServices.join(", ")}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-stone-500 font-medium">Subtotal</span>
            <span className="td-mono text-stone-800">{formatPrice(priceDetails.basePrice)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-500 font-medium">GST (15%)</span>
            <span className="td-mono text-stone-800">{formatPrice(priceDetails.gst)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider font-bold text-primary">Total Est.</span>
            <span className="td-mono text-xl font-semibold text-primary">{formatPrice(priceDetails.total)}</span>
          </div>
        </div>

        <div className="text-[10px] text-muted-text leading-relaxed bg-background/50 p-4 border border-border/60">
          <p className="font-semibold text-stone-700 mb-1">Auckland pricing policy</p>
          Prices are calculated dynamically based on regional variables. Travel is included within central Auckland suburbs. Larger or complex properties are subject to on-site assessment.
        </div>
      </motion.div>
    </div>
  );
}

export default function BookCleaningPage() {
  return (
    <div className="container mx-auto py-20 px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-4 border-b border-border pb-8"
      >
        <span className="font-caption">Reservations</span>
        <h1 className="font-serif text-[36px] md:text-[42px] lg:text-[48px] text-primary font-light">
          Book Your Bespoke Clean
        </h1>
        <p className="text-sm text-muted-text max-w-xl leading-relaxed">
          Provide your property details and scheduling preferences. Our live calculator updates your estimate instantly. No payment is required to submit.
        </p>
      </motion.div>

      <Suspense fallback={<div className="py-20 text-center text-xs font-mono text-muted-text animate-pulse">Loading reservation form...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
