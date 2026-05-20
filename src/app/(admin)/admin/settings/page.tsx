import prisma from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";
import { SectionHeader } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, staff, testimonials, activityLogs] = await Promise.all([
    prisma.setting.findMany({
      orderBy: { key: "asc" },
    }).catch(() => []),
    prisma.staff.findMany({
      include: { user: true },
      orderBy: { firstName: "asc" },
    }).catch(() => []),
    prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.activityLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="System Settings"
        description="Configure parameters, manage workmen roster, review client testimonials"
      />

      <SettingsClient
        settings={settings}
        staff={staff}
        testimonials={testimonials}
        activityLogs={activityLogs}
      />
    </div>
  );
}
