import React from "react";
import { Table, Search, Download, CheckCircle, AlertTriangle } from "lucide-react";

export default function FinancialStatementsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Statements</h1>
          <p className="text-sm text-slate-500 mt-1">Apple Inc. (AAPL) | Standardized | USD Millions</p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-bold text-sm">Income Statement</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-900 font-semibold text-sm">Balance Sheet</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-900 font-semibold text-sm">Cash Flow</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-900 font-semibold text-sm">Ratios</button>
      </div>

      {/* Trust & Reconciliation Score */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-bold text-green-900 text-sm">Accounting Integrity Passed</h3>
            <p className="text-xs text-green-700 mt-0.5">Assets = Liabilities + Equity. Retained earnings reconciled.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Data Reliability Score</span>
          <p className="text-xl font-bold text-green-800">98 / 100</p>
        </div>
      </div>

      {/* Statement Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex justify-between items-center">
          <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
             <input type="text" placeholder="Search line item..." className="text-sm pl-9 pr-4 py-1.5 border border-slate-200 rounded bg-white w-64" />
          </div>
          <div className="flex gap-2">
             <button className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-1 rounded">Annual</button>
             <button className="text-xs font-semibold text-slate-500 px-2 py-1 hover:bg-slate-100 rounded">Quarterly</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right tabular-nums">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="text-left font-medium py-3 px-6">Line Item</th>
                <th className="font-medium py-3 px-6">FY20</th>
                <th className="font-medium py-3 px-6">FY21</th>
                <th className="font-medium py-3 px-6">FY22</th>
                <th className="font-medium py-3 px-6">FY23</th>
                <th className="font-medium py-3 px-6 text-primary">FY24</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="text-left py-2 px-6 font-semibold text-slate-900">Total Revenue</td>
                <td className="py-2 px-6">274,515</td>
                <td className="py-2 px-6">365,817</td>
                <td className="py-2 px-6">394,328</td>
                <td className="py-2 px-6">383,285</td>
                <td className="py-2 px-6 font-semibold text-slate-900">388,400</td>
              </tr>
              <tr className="hover:bg-slate-50/50 text-slate-600">
                <td className="text-left py-2 px-6 pl-10">Cost of Goods Sold</td>
                <td className="py-2 px-6">169,559</td>
                <td className="py-2 px-6">212,981</td>
                <td className="py-2 px-6">223,546</td>
                <td className="py-2 px-6">214,137</td>
                <td className="py-2 px-6">213,200</td>
              </tr>
              <tr className="hover:bg-slate-50/50 bg-slate-50">
                <td className="text-left py-2 px-6 font-semibold text-slate-900">Gross Profit</td>
                <td className="py-2 px-6">104,956</td>
                <td className="py-2 px-6">152,836</td>
                <td className="py-2 px-6">170,782</td>
                <td className="py-2 px-6">169,148</td>
                <td className="py-2 px-6 font-semibold text-slate-900">175,200</td>
              </tr>
              <tr className="hover:bg-slate-50/50 text-slate-600">
                <td className="text-left py-2 px-6 pl-10">Research & Development</td>
                <td className="py-2 px-6">18,752</td>
                <td className="py-2 px-6">21,914</td>
                <td className="py-2 px-6">26,251</td>
                <td className="py-2 px-6">29,915</td>
                <td className="py-2 px-6">31,000</td>
              </tr>
              <tr className="hover:bg-slate-50/50 text-slate-600">
                <td className="text-left py-2 px-6 pl-10">SG&A</td>
                <td className="py-2 px-6">19,916</td>
                <td className="py-2 px-6">21,973</td>
                <td className="py-2 px-6">25,094</td>
                <td className="py-2 px-6">24,932</td>
                <td className="py-2 px-6">25,700</td>
              </tr>
              <tr className="hover:bg-slate-50/50 bg-slate-50 border-t-2 border-slate-200">
                <td className="text-left py-2 px-6 font-bold text-slate-900">Operating Income (EBIT)</td>
                <td className="py-2 px-6">66,288</td>
                <td className="py-2 px-6">108,949</td>
                <td className="py-2 px-6">119,437</td>
                <td className="py-2 px-6">114,301</td>
                <td className="py-2 px-6 font-bold text-slate-900">118,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
