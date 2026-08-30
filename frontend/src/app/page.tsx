"use client";
import React, { useState, useEffect } from "react";
import { Info, AlertTriangle, CheckCircle, ShieldCheck, TrendingUp, TrendingDown, Clock, Loader2, Building2, Users, Globe, BarChart3 } from "lucide-react";
import { useTicker } from "@/context/TickerContext";
import { fetchApi } from "@/lib/api";

type ViewMode = "ANALYST" | "FACTS" | "INVESTOR";

function fmt(n: number | null | undefined, prefix = "", suffix = "", decimals = 0) {
  if (n == null) return "N/A";
  return `${prefix}${n.toLocaleString(undefined, { maximumFractionDigits: decimals })}${suffix}`;
}
function fmtB(n: number | null | undefined) {
  if (n == null) return "N/A";
  return `$${(n / 1e9).toFixed(1)}B`;
}

export default function OverviewPage() {
  const { globalTicker } = useTicker();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("ANALYST");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchApi(`api/v1/company/${globalTicker}`);
        setCompany(data);
      } catch (e: any) {
        setError(e.message || "Failed to load company data");
        setCompany(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [globalTicker]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLoading ? <Loader2 className="w-7 h-7 animate-spin text-slate-400 inline" /> : (company?.name || globalTicker)}
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-700">{globalTicker}</span>
            {company?.exchange && <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-700">{company.exchange}</span>}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {company ? `${company.sector} | Market Cap: ${fmtB(company.market_cap)} | P/E: ${company.pe_ratio ? `${company.pe_ratio}x` : "N/A"}` : "Loading..."}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
          {(["FACTS", "ANALYST", "INVESTOR"] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-sm font-semibold rounded transition-all ${viewMode === mode ? "bg-white shadow-sm text-primary" : "text-slate-600 hover:text-slate-900"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-900 text-sm">Could not load company data</h3>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <HeroCard title="Business Quality" score="85" status="positive" />
            <HeroCard title="Financial Strength" score="92" status="positive" />
            <HeroCard title="Earnings Quality" score="78" status="warning" />
            <HeroCard title="Governance" score="95" status="positive" />
            <HeroCard title="Valuation" score="45" status="negative" />
            <HeroCard title="Risk" score="22" status="positive" label="Low Risk" />
            <HeroCard title="Data Reliability" score="98" status="positive" />
          </div>

          {/* FACTS view */}
          {viewMode === "FACTS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FactCard icon={<Building2 className="w-4 h-4" />} title="Company Overview">
                <dl className="space-y-2 text-sm">
                  <FactRow label="Sector" value={company?.sector || "N/A"} />
                  <FactRow label="Industry" value={company?.industry || "N/A"} />
                  <FactRow label="Exchange" value={company?.exchange || "N/A"} />
                  <FactRow label="Employees" value={company?.employees ? company.employees.toLocaleString() : "N/A"} />
                  {company?.website && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Website</span>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs truncate max-w-[160px]">{company.website.replace("https://", "")}</a>
                    </div>
                  )}
                </dl>
              </FactCard>

              <FactCard icon={<BarChart3 className="w-4 h-4" />} title="Market Data">
                <dl className="space-y-2 text-sm">
                  <FactRow label="Current Price" value={fmt(company?.current_price, "$", "", 2)} />
                  <FactRow label="Market Cap" value={fmtB(company?.market_cap)} />
                  <FactRow label="P/E Ratio (TTM)" value={company?.pe_ratio ? `${company.pe_ratio}x` : "N/A"} />
                  <FactRow label="52W High" value={fmt(company?.["52w_high"], "$", "", 2)} />
                  <FactRow label="52W Low" value={fmt(company?.["52w_low"], "$", "", 2)} />
                </dl>
              </FactCard>

              <FactCard icon={<Globe className="w-4 h-4" />} title="Financial Summary">
                <dl className="space-y-2 text-sm">
                  <FactRow label="Revenue (TTM)" value={fmt(company?.revenue_m, "$", "M")} />
                  <FactRow label="Free Cash Flow" value={fmt(company?.free_cash_flow_m, "$", "M")} />
                  <FactRow label="Net Debt / (Cash)" value={fmt(company?.net_debt_m, "$", "M")} />
                  <FactRow label="Shares Outstanding" value={fmt(company?.shares_outstanding_m, "", "M")} />
                </dl>
              </FactCard>

              {company?.description && (
                <div className="md:col-span-2 lg:col-span-3 bg-white rounded-md border border-slate-200 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Business Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-5">{company.description}</p>
                </div>
              )}
            </div>
          )}

          {/* ANALYST view */}
          {viewMode === "ANALYST" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Analyst Thesis */}
                <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">Analyst Thesis — {company?.name || globalTicker}</div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50/50 border border-green-100 rounded p-4">
                        <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Bull Case</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Strong fundamentals, expanding margins, and sector leadership provide a durable competitive moat. Revenue growth accelerates driven by new product lines and geographic expansion.
                        </p>
                      </div>
                      <div className="bg-red-50/50 border border-red-100 rounded p-4">
                        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Bear Case</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Market saturation, rising competition, and regulatory headwinds could compress margins. Macro slowdown may delay major capital projects and growth targets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Trajectory */}
                <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex justify-between">
                    <span>Key Financial Metrics</span>
                    <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Live Data</span>
                  </div>
                  <div className="p-0">
                    <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
                      {[
                        { label: "Current Price", value: fmt(company?.current_price, "$", "", 2) },
                        { label: "Market Cap", value: fmtB(company?.market_cap) },
                        { label: "P/E Ratio", value: company?.pe_ratio ? `${company.pe_ratio}x` : "N/A" },
                        { label: "Revenue (TTM)", value: fmt(company?.revenue_m, "$", "M") },
                        { label: "Free Cash Flow", value: fmt(company?.free_cash_flow_m, "$", "M") },
                        { label: "52W Range", value: `${fmt(company?.["52w_low"], "$", "", 2)} – ${fmt(company?.["52w_high"], "$", "", 2)}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-4">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
                          <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
                    <span>Thesis Falsifiers</span>
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="border-l-2 border-red-500 pl-3">
                      <p className="text-sm font-semibold text-slate-800">Revenue Growth Deceleration</p>
                      <p className="text-xs text-slate-500 mt-1">If revenue growth drops below 5% YoY for two consecutive quarters.</p>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-3">
                      <p className="text-sm font-semibold text-slate-800">Margin Compression</p>
                      <p className="text-xs text-slate-500 mt-1">If gross margin contracts more than 3 percentage points in a year.</p>
                    </div>
                    <div className="border-l-2 border-red-500 pl-3">
                      <p className="text-sm font-semibold text-slate-800">FCF Deterioration</p>
                      <p className="text-xs text-slate-500 mt-1">If free cash flow conversion drops below 70% of net income.</p>
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
                        <p className="text-3xl font-bold text-slate-900">{fmt(company?.current_price, "$", "", 2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Market Cap</p>
                        <p className="text-lg font-bold text-primary">{fmtB(company?.market_cap)}</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      {[
                        { label: "Bear (P10)", pct: 30, color: "bg-red-400" },
                        { label: "Base (Median)", pct: 65, color: "bg-primary" },
                        { label: "Bull (P90)", pct: 85, color: "bg-green-500" },
                      ].map(({ label, pct, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">{label}</span>
                            <span className="font-semibold">{pct}% confidence</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVESTOR view */}
          {viewMode === "INVESTOR" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Investment Checklist
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: "Durable Competitive Moat", pass: true },
                    { label: "Predictable Revenue Model", pass: true },
                    { label: "Capital-Light Business", pass: true },
                    { label: "High ROIC (> 15%)", pass: true },
                    { label: "Conservative Balance Sheet", pass: company?.net_debt_m != null && company.net_debt_m < 0 },
                    { label: "Shareholder-Friendly Management", pass: true },
                    { label: "Attractive Valuation", pass: false },
                  ].map(({ label, pass }) => (
                    <div key={label} className="flex items-center gap-3">
                      {pass
                        ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                      <span className={`text-sm ${pass ? "text-slate-700" : "text-slate-500"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">Key Investment Metrics</div>
                <div className="divide-y divide-slate-100">
                  {[
                    { label: "Current Price", value: fmt(company?.current_price, "$", "", 2), highlight: true },
                    { label: "Market Cap", value: fmtB(company?.market_cap) },
                    { label: "P/E Ratio", value: company?.pe_ratio ? `${company.pe_ratio}x` : "N/A" },
                    { label: "FCF Yield", value: company?.free_cash_flow && company?.market_cap ? `${((company.free_cash_flow / company.market_cap) * 100).toFixed(2)}%` : "N/A" },
                    { label: "Net Debt / (Cash)", value: fmt(company?.net_debt_m, "$", "M") },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className={`flex justify-between items-center px-4 py-3 text-sm ${highlight ? "bg-primary/5" : ""}`}>
                      <span className="text-slate-600">{label}</span>
                      <span className={`font-bold tabular-nums ${highlight ? "text-primary" : "text-slate-900"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function HeroCard({ title, score, status, label }: { title: string; score: string; status: "positive" | "negative" | "warning"; label?: string }) {
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
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${colorMap[status]}`}>
          {label || "/ 100"}
        </span>
      </div>
    </div>
  );
}

function FactCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center gap-2 text-sm">
        {icon} {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
