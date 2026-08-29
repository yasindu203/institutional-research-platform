"use client";
import React, { useState, useEffect } from "react";
import { AlertTriangle, User, Users, ShieldAlert, CheckCircle, Scale, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function GovernancePage() {
  const [scoreData, setScoreData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadGovernanceData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi('api/v1/governance/score', {
        method: 'POST',
        body: JSON.stringify({
          board: { total_directors: 10, independent_directors: 7, female_directors: 3, ceo_is_chair: false },
          audit: { material_weakness: false, qualified_opinion: false, auditor_tenure_years: 14, big_four: true },
          compensation: { ltip_pct_of_total: 0.60, clawback_policy: true, say_on_pay_approval_pct: 95.0 },
          ownership: { dual_class_shares: false, institutional_ownership_pct: 70.0, insider_ownership_pct: 5.0 },
          related_parties: { material_transactions: false }
        })
      });
      setScoreData(data);
    } catch (err) {
      console.error("Failed to load governance data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGovernanceData();
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Governance & Management</h1>
          <p className="text-sm text-slate-500 mt-1">Apple Inc. (AAPL)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-5 relative min-h-[160px]">
           <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Scale className="w-4 h-4"/> Governance Score</h3>
           
           {isLoading || !scoreData ? (
             <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
           ) : (
             <>
               <div className="flex items-end gap-3">
                 <span className="text-5xl font-bold text-slate-800">{scoreData.overall_score}</span>
                 <span className={`text-sm font-bold bg-opacity-10 px-2 py-1 rounded border mb-1 ${scoreData.tier === 'EXCELLENT' ? 'text-green-600 bg-green-50 border-green-200' : 'text-primary bg-primary border-primary'}`}>
                   {scoreData.tier}
                 </span>
               </div>
               <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                 {scoreData.flags.includes("AMBER") ? "Caution: Contains Amber flags." : "Top quintile globally. Complete independence between Chair and CEO. No related party transactions of material concern."}
               </p>
             </>
           )}
        </div>
        
        <div className="col-span-2 bg-white rounded-md border border-slate-200 shadow-sm p-0 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-800">
            Institutional Override Flags
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading || !scoreData ? (
              <div className="col-span-2 flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : (
              <>
                <FlagItem status={scoreData.breakdown.audit === 25 ? 'green' : 'amber'} title="Audit Quality" desc={`Score: ${scoreData.breakdown.audit}/25. Auditor tenure is 14 years.`} />
                <FlagItem status={scoreData.breakdown.related_parties === 10 ? 'green' : 'red'} title="Related Parties" desc={`Score: ${scoreData.breakdown.related_parties}/10. No material undisclosed loans or assets.`} />
                <FlagItem status={scoreData.breakdown.ownership === 20 ? 'green' : 'amber'} title="Shareholder Abuse" desc={`Score: ${scoreData.breakdown.ownership}/20. Single class share structure. High float.`} />
                <FlagItem status={scoreData.breakdown.board === 25 ? 'green' : 'amber'} title="Board Independence" desc={`Score: ${scoreData.breakdown.board}/25.`} />
              </>
            )}
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

function FlagItem({ status, title, desc }: { status: 'green'|'amber'|'red', title: string, desc: string }) {
  const getColors = () => {
    if (status === 'green') return 'bg-green-50 border-green-100 text-green-800';
    if (status === 'amber') return 'bg-amber-50 border-amber-100 text-amber-800';
    return 'bg-red-50 border-red-100 text-red-800';
  };
  
  return (
    <div className={`p-3 rounded-md border ${getColors()}`}>
      <div className="flex items-center gap-2 mb-1">
        {status === 'green' ? <CheckCircle className="w-4 h-4 text-green-600" /> : 
         status === 'amber' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : 
         <ShieldAlert className="w-4 h-4 text-red-600" />}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <p className="text-xs opacity-80 pl-6">{desc}</p>
    </div>
  );
}
