import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user || !["OWNER", "ADMIN", "STAFF"].includes(session.user.role as string)) {
    redirect("/login");
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
