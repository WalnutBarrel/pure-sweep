/* eslint-disable @next/next/no-img-element */
interface LogoNavbarProps {
  className?: string;
  variant?: "dark" | "light";
}

/**
 * Horizontal navbar logo: circular badge + "PURESWEEP / CLEANING" text.
 * Optimized for header & footer usage at 40–60 px height.
 */
export default function LogoNavbar({
  className = "",
  variant = "dark",
}: LogoNavbarProps) {
  const isDark = variant === "dark";
  const textColor = isDark ? "#0B1F3F" : "#FFFFFF";
  const subColor = isDark ? "#3BB5B0" : "#B5EFE8";

  return (
    <div
      className={`flex items-center gap-2.5 select-none ${className}`}
      style={{ lineHeight: 1 }}
    >
      {/* Logo badge */}
      <img
        src="/images/puresweep-logo.png"
        alt="PureSweep Cleaning"
        className="h-14 md:h-16 w-auto object-contain rounded-full"
      />


      {/* Wordmark */}
      <div className="flex flex-col justify-center">
        <span
          className="text-[15px] md:text-[17px] font-extrabold tracking-[0.04em]"
          style={{
            color: textColor,
            fontFamily: "var(--font-sans), Manrope, 'Segoe UI', sans-serif",
          }}
        >
          PURESWEEP
        </span>
        <span
          className="text-[8px] md:text-[9px] font-semibold tracking-[0.28em] mt-0.5"
          style={{
            color: subColor,
            fontFamily: "var(--font-sans), Manrope, 'Segoe UI', sans-serif",
          }}
        >
          CLEANING
        </span>
      </div>
    </div>
  );
}
