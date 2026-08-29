import React from "react";
import { AlertTriangle, User, Users, ShieldAlert, CheckCircle, Scale } from "lucide-react";

export default function GovernancePage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Governance & Management</h1>
          <p className="text-sm text-slate-500 mt-1">Apple Inc. (AAPL)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-5">
           <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Scale className="w-4 h-4"/> Governance Score</h3>
           <div className="flex items-end gap-3">
             <span className="text-5xl font-bold text-slate-800">95</span>
             <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 mb-1">EXCELLENT</span>
           </div>
           <p className="text-sm text-slate-500 mt-4 leading-relaxed">Top quintile globally. Complete independence between Chair and CEO. No related party transactions of material concern.</p>
        </div>
        
        <div className="col-span-2 bg-white rounded-md border border-slate-200 shadow-sm p-0 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-800">
            Institutional Override Flags
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FlagItem status="green" title="Audit Quality" desc="Unqualified opinion by EY. Auditor tenure is 14 years." />
            <FlagItem status="green" title="Related Parties" desc="No material undisclosed loans or assets." />
            <FlagItem status="green" title="Shareholder Abuse" desc="Single class share structure. High float." />
            <FlagItem status="green" title="Accounting Controls" desc="No material weaknesses reported." />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">
          Management Credibility (Promise vs Delivery)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="font-medium py-3 px-6 w-1/4">Commitment</th>
                <th className="font-medium py-3 px-6 w-1/6">Date</th>
                <th className="font-medium py-3 px-6 w-1/3">Target Outcome</th>
                <th className="font-medium py-3 px-6 w-1/4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-6 font-medium">Services Gross Margin Expansion</td>
                <td className="py-4 px-6 text-slate-500">Q3 2021</td>
                <td className="py-4 px-6">Management guided to 70%+ gross margins in services segment.</td>
                <td className="py-4 px-6">
                  <span className="flex items-center gap-1.5 text-green-700 font-semibold text-xs bg-green-50 w-max px-2 py-1 rounded">
                    <CheckCircle className="w-3.5 h-3.5" /> DELIVERED (Achieved 71.5%)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-6 font-medium">Net Cash Neutral</td>
                <td className="py-4 px-6 text-slate-500">Q1 2018</td>
                <td className="py-4 px-6">Reach a net cash neutral position over time via buybacks/dividends.</td>
                <td className="py-4 px-6">
                  <span className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs bg-amber-50 w-max px-2 py-1 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" /> PARTIALLY DELIVERED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function FlagItem({ status, title, desc }: { status: 'green'|'red', title: string, desc: string }) {
  return (
    <div className={`p-3 rounded-md border ${status === 'green' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
      <div className="flex items-center gap-2 mb-1">
        {status === 'green' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <ShieldAlert className="w-4 h-4 text-red-600" />}
        <span className={`font-semibold text-sm ${status === 'green' ? 'text-green-800' : 'text-red-800'}`}>{title}</span>
      </div>
      <p className="text-xs text-slate-600 pl-6">{desc}</p>
    </div>
  );
}
