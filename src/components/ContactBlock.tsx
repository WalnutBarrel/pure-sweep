import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactBlock() {
  return (
    <div className="bg-surface border border-border p-8 md:p-10 space-y-8 font-sans">
      <div className="space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Coordinates</span>
        <h3 className="font-serif text-2xl text-primary font-normal">PureSweep Auckland</h3>
      </div>

      <div className="space-y-6">
        {/* Phone */}
        <div className="flex gap-4">
          <div className="bg-primary-soft p-2.5 h-fit text-primary rounded-none shrink-0">
            <Phone className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Direct Telephone</h4>
            <p className="text-sm font-semibold text-stone-800">021-026999-56</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex gap-4">
          <div className="bg-primary-soft p-2.5 h-fit text-primary rounded-none shrink-0">
            <Mail className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Inquiry</h4>
            <p className="text-sm font-semibold text-stone-800">contact.puresweep@gmail.com</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-4">
          <div className="bg-primary-soft p-2.5 h-fit text-primary rounded-none shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Office Location</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Hillsborough Road, Hillsborough 1042<br />
              Auckland, New Zealand
            </p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex gap-4">
          <div className="bg-primary-soft p-2.5 h-fit text-primary rounded-none shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Business Hours</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Monday - Saturday: 08:00 AM - 06:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
