import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const titleSetting = await prisma.setting.findUnique({ where: { key: "seo_book_title" } });
  const descSetting = await prisma.setting.findUnique({ where: { key: "seo_book_desc" } });
  
  return {
    title: titleSetting?.value || "Book a Cleaning | PureSweep Auckland",
    description: descSetting?.value || "Schedule your next premium clean with PureSweep. Fast, easy, and secure online booking for Auckland residents and businesses.",
  };
}

export default function BookCleaningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
