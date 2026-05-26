import Container from "@/components/Container";

export const metadata = {
  title: "Privacy Policy",
  description: "PureSweep Cleaning Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-20 max-w-3xl">
      <h1 className="text-4xl font-serif text-secondary mb-8">Privacy Policy</h1>
      
      <div className="prose prose-stone prose-sm md:prose-base text-muted-text space-y-6">
        <p><strong>Last Updated: May 2026</strong></p>

        <p>
          At PureSweep Cleaning, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner in accordance with the New Zealand Privacy Act 2020.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect personal information from you, including information about your:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name</li>
          <li>Contact information (email address and phone number)</li>
          <li>Location / Residential Address</li>
          <li>Billing or purchase information (processed securely through our payment partners)</li>
        </ul>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">2. How We Use Your Information</h2>
        <p>
          We collect your personal information in order to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and schedule our cleaning services</li>
          <li>Communicate with you regarding your bookings or inquiries</li>
          <li>Process billing and send invoices</li>
          <li>Improve our services and customer experience</li>
        </ul>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">3. Sharing Your Information</h2>
        <p>
          Besides our staff, we share this information with our carefully selected software providers (such as booking platforms and payment gateways) solely for the purpose of operating our business. We do not sell, rent, or lease your personal information to third parties.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">4. Security</h2>
        <p>
          We keep your information safe by storing it in encrypted, secure databases and only allowing authorized administrative staff to access it.
        </p>

        <h2 className="text-xl font-bold text-secondary mt-8 mb-4">5. Your Rights</h2>
        <p>
          You have the right to ask for a copy of any personal information we hold about you, and to ask for it to be corrected if you think it is wrong. If you’d like to ask for a copy of your information, or to have it corrected, please contact us at <strong>contact.puresweep@gmail.com</strong>.
        </p>
      </div>
    </Container>
  );
}
