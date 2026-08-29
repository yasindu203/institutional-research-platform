"use client";
import React, { useState, useEffect } from "react";
import { Info, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, TrendingUp, TrendingDown, Clock, Loader2 } from "lucide-react";
import { useTicker } from "@/context/TickerContext";

export default function OverviewPage() {
  const { globalTicker } = useTicker();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [globalTicker]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header & View Mode */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{globalTicker} Corporation</h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-700">{globalTicker}</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-700">NASDAQ</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Technology | Market Cap: $1.2T | P/E: 24.5x</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
          <button className="px-4 py-1.5 text-sm font-semibold rounded text-slate-600 hover:text-slate-900">FACTS</button>
          <button className="px-4 py-1.5 text-sm font-semibold rounded bg-white shadow-sm text-primary">ANALYST</button>
          <button className="px-4 py-1.5 text-sm font-semibold rounded text-slate-600 hover:text-slate-900">INVESTOR</button>
        </div>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <HeroCard title="Business Quality" score="85" status="positive" />
        <HeroCard title="Financial Strength" score="92" status="positive" />
        <HeroCard title="Earnings Quality" score="78" status="warning" />
        <HeroCard title="Governance" score="95" status="positive" />
        <HeroCard title="Valuation" score="45" status="negative" />
        <HeroCard title="Risk" score="22" status="positive" label="Low Risk" />
        <HeroCard title="Data Reliability" score="98" status="positive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column - Narrative */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">
              Analyst Thesis
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50/50 border border-green-100 rounded p-4">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Bull Case
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Services revenue accelerates driven by AI integrations and expanding ARPU. Ecosystem lock-in drives 95% retention. Gross margins expand beyond 46%.
                  </p>
                </div>
                <div className="bg-red-50/50 border border-red-100 rounded p-4">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" /> Bear Case
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hardware replacement cycles extend to 4+ years. Regulatory pressure forces App Store fee reductions, compressing high-margin services revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Drivers Table */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex justify-between">
              <span>Financial Trajectory</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded">In USD Millions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="text-left font-medium py-2 px-4">Metric</th>
                    <th className="font-medium py-2 px-4">FY22</th>
                    <th className="font-medium py-2 px-4">FY23</th>
                    <th className="font-medium py-2 px-4">FY24E</th>
                    <th className="font-medium py-2 px-4">FY25E</th>
                    <th className="font-medium py-2 px-4 text-primary">CAGR (3Y)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  <tr className="hover:bg-slate-50/50">
                    <td className="text-left py-2 px-4 font-medium">Revenue</td>
                    <td className="py-2 px-4">394,328</td>
                    <td className="py-2 px-4">383,285</td>
                    <td className="py-2 px-4 font-semibold">388,400</td>
                    <td className="py-2 px-4 font-semibold">410,200</td>
                    <td className="py-2 px-4 text-primary font-medium">1.3%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="text-left py-2 px-4 font-medium">Gross Margin</td>
                    <td className="py-2 px-4">43.3%</td>
                    <td className="py-2 px-4">44.1%</td>
                    <td className="py-2 px-4 font-semibold">45.0%</td>
                    <td className="py-2 px-4 font-semibold">45.5%</td>
                    <td className="py-2 px-4 text-slate-500">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="text-left py-2 px-4 font-medium">EBIT</td>
                    <td className="py-2 px-4">119,437</td>
                    <td className="py-2 px-4">114,301</td>
                    <td className="py-2 px-4 font-semibold">118,500</td>
                    <td className="py-2 px-4 font-semibold">126,800</td>
                    <td className="py-2 px-4 text-primary font-medium">2.0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="text-left py-2 px-4 font-medium">EPS (Diluted)</td>
                    <td className="py-2 px-4">6.11</td>
                    <td className="py-2 px-4">6.13</td>
                    <td className="py-2 px-4 font-semibold">6.55</td>
                    <td className="py-2 px-4 font-semibold">7.10</td>
                    <td className="py-2 px-4 text-primary font-medium">5.1%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="text-left py-2 px-4 font-medium">FCF</td>
                    <td className="py-2 px-4">111,443</td>
                    <td className="py-2 px-4">99,584</td>
                    <td className="py-2 px-4 font-semibold">105,000</td>
                    <td className="py-2 px-4 font-semibold">112,000</td>
                    <td className="py-2 px-4 text-primary font-medium">0.2%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="text-left py-2 px-4 font-medium">ROIC</td>
                    <td className="py-2 px-4">58.2%</td>
                    <td className="py-2 px-4">56.1%</td>
                    <td className="py-2 px-4 font-semibold">57.0%</td>
                    <td className="py-2 px-4 font-semibold">59.5%</td>
                    <td className="py-2 px-4 text-slate-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Risks & Valuation */}
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
              <span>Thesis Falsifiers</span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-4 space-y-4">
              <div className="border-l-2 border-red-500 pl-3">
                <p className="text-sm font-semibold text-slate-800">Services Growth Deceleration</p>
                <p className="text-xs text-slate-500 mt-1">If Services revenue growth drops below 8% YoY for two consecutive quarters.</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <p className="text-sm font-semibold text-slate-800">Gross Margin Compression</p>
                <p className="text-xs text-slate-500 mt-1">If overall gross margin falls below 42%.</p>
              </div>
              <div className="border-l-2 border-red-500 pl-3">
                <p className="text-sm font-semibold text-slate-800">China Market Share Loss</p>
                <p className="text-xs text-slate-500 mt-1">If Greater China revenue declines &gt;15% YoY.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
              <span>Implied Valuation</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Price</p>
                  <p className="text-3xl font-bold text-slate-900">$185.20</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Intrinsic Value Range</p>
                  <p className="text-lg font-bold text-primary">$150 - $190</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Bear (P10)</span>
                    <span className="font-semibold">$135</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Base (Median)</span>
                    <span className="font-semibold">$172</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Bull (P90)</span>
                    <span className="font-semibold">$215</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Current price implies 5.5% terminal growth rate holding margins flat, which is above historical averages.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function HeroCard({ title, score, status, label }: { title: string, score: string, status: 'positive' | 'negative' | 'warning', label?: string }) {
  const colorMap = {
    positive: "text-green-600 bg-green-50 border-green-200",
    negative: "text-red-600 bg-red-50 border-red-200",
    warning: "text-amber-600 bg-amber-50 border-amber-200",
  };
  
  return (
    <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <Info className="w-3.5 h-3.5 text-slate-300" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-800 tabular-nums">{score}</span>
        {label ? (
           <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${colorMap[status]}`}>
            {label}
          </span>
        ) : (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${colorMap[status]}`}>
            / 100
          </span>
        )}
      </div>
    </div>
  );
}
