import prisma from "@/lib/prisma";
import { ExpensesClient } from "./ExpensesClient";
import { SectionHeader } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

export default async function AdminExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6 animate-enter-fade">
      <SectionHeader
        title="Expenditure & Outgoings"
        description={`${expenses.length} operating expenditures logged`}
      />

      <ExpensesClient expenses={expenses} />
    </div>
  );
}
