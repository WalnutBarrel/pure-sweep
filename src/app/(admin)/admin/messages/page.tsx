import prisma from "@/lib/prisma";
import { MessagesClient } from "./MessagesClient";
import { SectionHeader } from "@/components/admin/DataTable";
import { serialize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Client Inquiries"
        description={`${messages.length} contact form submissions`}
      />

      <MessagesClient messages={serialize(messages)} />
    </div>
  );
}
