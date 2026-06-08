"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wrench,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  ExternalLink,
  DollarSign,
  Mail,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Inbox", icon: Mail },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/expenses", label: "Expenses", icon: DollarSign },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      {/* Brand Header */}
      <div className="h-[60px] border-b border-stone-800 flex items-center px-5 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <img 
            src="/images/puresweep-logo.png" 
            alt="PureSweep Cleaning" 
            className="h-7 w-auto object-contain" 
          />
          <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest border border-stone-850 px-1">Console</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-800 space-y-2 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-[12px] text-stone-500 hover:text-stone-300 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
          Public Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-3 py-2 text-[12px] text-stone-500 hover:text-stone-300 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </>
  );
}

import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive page title from pathname
  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const pageTitle = currentPage?.label || "Dashboard";

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#F5F4F1] text-stone-900 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[240px] bg-stone-900 text-stone-100 flex-col shrink-0 border-r border-stone-800">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-stone-900 text-stone-100 flex flex-col z-10">
              <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-[60px] bg-white border-b border-stone-200 flex items-center justify-between px-5 lg:px-8 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <h1 className="text-[13px] font-semibold uppercase tracking-widest text-stone-500">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-stone-400" strokeWidth={1.5} />
              <span className="text-[11px] font-mono text-stone-400 uppercase hidden sm:block">
                PureSweep Auckland
              </span>
            </div>
          </header>

          {/* Page Content */}
          <main id="admin-main-content" className="flex-1 overflow-y-auto p-5 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
