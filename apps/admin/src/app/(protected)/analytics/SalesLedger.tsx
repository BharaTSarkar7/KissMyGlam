"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateSaleRecord, updateTotalExpense } from "./actions";
import { SaleRecordUpdateValues } from "@/lib/validations/analytics";

interface SaleRecordItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  boughtFor: number | null;
  soldFor: number | null;
  dateSold: Date | null;
  dateInStock: Date | null;
  payment: "PAID" | "UNPAID";
}

interface SalesLedgerProps {
  records: SaleRecordItem[];
  totalExpense: number;
}

export const SalesLedger: React.FC<SalesLedgerProps> = ({
  records,
  totalExpense,
}) => {
  const [, startTransition] = useTransition();
  const [expense, setExpense] = useState(totalExpense.toString());

  // Calculations
  const totalSales = records.reduce((sum, r) => sum + (r.soldFor || 0), 0);
  const totalCost = records.reduce((sum, r) => sum + (r.boughtFor || 0), 0);
  const grossProfit = totalSales - totalCost - Number(expense);
  const totalItemsSold = records.length;

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense(e.target.value);
  };

  const handleExpenseBlur = () => {
    if (expense !== totalExpense.toString()) {
      startTransition(() => {
        updateTotalExpense(expense);
      });
    }
  };

  const handleRecordChange = (
    id: string,
    field: keyof SaleRecordUpdateValues,
    value: SaleRecordUpdateValues[keyof SaleRecordUpdateValues]
  ) => {
    startTransition(() => {
      updateSaleRecord(id, { [field]: value } as SaleRecordUpdateValues);
    });
  };

  return (
    <div className="w-full space-y-10">
      {/* OVERALL SUMMARY */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-line/50 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-ink-soft font-medium">Total Sales</span>
          <span className="text-2xl font-serif text-ink">₹{totalSales.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-line/50 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-ink-soft font-medium">Total Cost of Goods</span>
          <span className="text-2xl font-serif text-ink">₹{totalCost.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-line/50 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-ink-soft font-medium flex items-center justify-between">
            Total Expense
          </span>
          <div className="flex items-center text-2xl font-serif text-ink">
            <span>₹</span>
            <input
              type="number"
              value={expense}
              onChange={handleExpenseChange}
              onBlur={handleExpenseBlur}
              className="w-full bg-transparent border-b border-dashed border-line/50 focus:border-ink focus:outline-none ml-1"
            />
          </div>
        </div>
        <div className="bg-ink p-6 rounded-[24px] border border-ink shadow-sm flex flex-col gap-1 text-white">
          <span className="text-xs uppercase tracking-widest text-white/70 font-medium">Gross Profit</span>
          <span className="text-2xl font-serif">₹{grossProfit.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-line/50 shadow-sm flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-ink-soft font-medium">Total Items Sold</span>
          <span className="text-2xl font-serif text-ink">{totalItemsSold}</span>
        </div>
      </section>

      {/* LEDGER TABLE */}
      <section className="bg-white rounded-[24px] shadow-sm border border-line/50 overflow-hidden">
        <div className="p-6 border-b border-line/50">
          <h2 className="font-serif text-2xl font-medium text-ink">Sales Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-ink text-white">
                <th className="p-4 font-medium text-sm text-white/90">Product</th>
                <th className="p-4 font-medium text-sm text-white/90">Date In-Stock</th>
                <th className="p-4 font-medium text-sm text-white/90">Bought For</th>
                <th className="p-4 font-medium text-sm text-white/90">Date Sold</th>
                <th className="p-4 font-medium text-sm text-white/90">Sold For</th>
                <th className="p-4 font-medium text-sm text-white/90">Net Profit</th>
                <th className="p-4 font-medium text-sm text-white/90">Payment</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-ink-soft">No sale records found. Mark a product as sold to start tracking!</td>
                </tr>
              ) : (
                records.map((r) => {
                  const netProfit = (r.soldFor && r.boughtFor) ? r.soldFor - r.boughtFor : null;
                  
                  return (
                    <tr key={r.id} className="border-b border-line last:border-b-0 hover:bg-bg-alt/30 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-12 relative rounded overflow-hidden bg-bg-alt flex-shrink-0">
                          {r.imageUrl ? (
                            <Image src={r.imageUrl} alt={r.productName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-ink-soft">No img</div>
                          )}
                        </div>
                        <span className="font-medium text-sm text-ink max-w-[150px] truncate" title={r.productName}>{r.productName}</span>
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          defaultValue={r.dateInStock ? new Date(r.dateInStock).toISOString().split('T')[0] : ""}
                          onBlur={(e) => handleRecordChange(r.id, "dateInStock", e.target.value || null)}
                          className="bg-transparent border-b border-transparent focus:border-ink focus:outline-none text-sm text-ink w-full min-w-[120px]"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-ink-soft mr-1">₹</span>
                          <input
                            type="number"
                            defaultValue={r.boughtFor || ""}
                            onBlur={(e) => handleRecordChange(r.id, "boughtFor", e.target.value ? Number(e.target.value) : null)}
                            className="w-20 bg-transparent border-b border-transparent focus:border-ink focus:outline-none text-sm text-ink"
                            placeholder="---"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          defaultValue={r.dateSold ? new Date(r.dateSold).toISOString().split('T')[0] : ""}
                          onBlur={(e) => handleRecordChange(r.id, "dateSold", e.target.value || null)}
                          className="bg-transparent border-b border-transparent focus:border-ink focus:outline-none text-sm text-ink"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-ink-soft mr-1">₹</span>
                          <input
                            type="number"
                            defaultValue={r.soldFor || ""}
                            onBlur={(e) => handleRecordChange(r.id, "soldFor", e.target.value ? Number(e.target.value) : null)}
                            className="w-20 bg-transparent border-b border-transparent focus:border-ink focus:outline-none text-sm text-ink"
                            placeholder="---"
                          />
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {netProfit !== null ? (
                          <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                            ₹{netProfit.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-ink-soft">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          defaultValue={r.payment}
                          onChange={(e) => handleRecordChange(r.id, "payment", e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full outline-none font-medium cursor-pointer appearance-none ${
                            r.payment === "PAID" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          <option value="PAID">PAID</option>
                          <option value="UNPAID">UNPAID</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
