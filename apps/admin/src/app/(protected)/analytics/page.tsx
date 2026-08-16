import { prisma } from "@kissmyglam/db";
import { SalesLedger } from "./SalesLedger";

export default async function AnalyticsPage() {
  const records = await prisma.saleRecord.findMany({
    orderBy: { createdAt: "desc" },
  });

  const expenseSetting = await prisma.adminSettings.findUnique({
    where: { key: "total_expense" },
  });

  const totalExpense = expenseSetting?.value ? Number(expenseSetting.value) : 0;

  // Convert decimal to number for the client component
  const formattedRecords = records.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: r.productName,
    imageUrl: r.imageUrl,
    dateInStock: r.dateInStock,
    boughtFor: r.boughtFor ? Number(r.boughtFor) : null,
    dateSold: r.dateSold,
    soldFor: r.soldFor ? Number(r.soldFor) : null,
    payment: r.payment,
  }));

  return (
    <div className="w-full pb-10">
      <h1 className="font-serif text-4xl font-medium text-ink mb-10">Analytics</h1>
      <SalesLedger records={formattedRecords} totalExpense={totalExpense} />
    </div>
  );
}
