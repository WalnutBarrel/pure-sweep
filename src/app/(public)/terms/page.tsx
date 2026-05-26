import Container from "@/components/Container";

export const metadata = {
  title: "Terms of Service",
  description: "PureSweep Cleaning Terms of Service.",
};

export default function TermsOfServicePage() {
  return (
    <Container className="py-20 max-w-3xl">
      <h1 className="text-4xl font-serif text-secondary mb-8">Terms of Service</h1>
      
      <div className="prose prose-stone prose-sm md:prose-base text-muted-text space-y-6">
        <p><strong>Last Updated: May 2026</strong></p>

        <p>
          Welcome to PureSweep Cleaning. By accessing our website or booking our services, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">1. Services</h2>
        <p>
          PureSweep Cleaning provides professional residential and commercial cleaning services in Auckland, New Zealand. We reserve the right to refuse service to anyone for any reason at any time.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">2. Bookings and Cancellations</h2>
        <p>
          All bookings are subject to availability and confirmation. We require at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the scheduled service may be subject to a cancellation fee.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">3. Pricing and Payments</h2>
        <p>
          Prices for our services are subject to change without notice. We reserve the right to modify or discontinue any service without notice at any time. Payment is required upon completion of the service unless otherwise agreed upon in writing. Invoices are subject to GST.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">4. Liability</h2>
        <p>
          While we take the utmost care while cleaning your property, PureSweep Cleaning is not liable for any pre-existing damage or wear and tear. Any claims for damages must be reported within 24 hours of the service completion.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">5. Governing Law</h2>
        <p>
          These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of New Zealand.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">6. Contact Information</h2>
        <p>
          Questions about the Terms of Service should be sent to us at <strong>contact.puresweep@gmail.com</strong>.
        </p>
      </div>
    </Container>
  );
}
