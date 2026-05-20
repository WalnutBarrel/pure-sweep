import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-6">
        <p className="text-[10px] uppercase tracking-widest text-muted-text font-semibold">
          Error 404
        </p>
        <h1 className="font-serif text-[36px] md:text-[48px] text-primary font-light leading-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-text leading-relaxed">
          The page you are looking for does not exist or has been moved.
          Please check the URL or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
