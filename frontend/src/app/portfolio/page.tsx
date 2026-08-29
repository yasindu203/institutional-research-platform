"use client";
import React, { useState } from "react";
import { Briefcase, Plus, Filter, SlidersHorizontal, ArrowUpRight, Loader2, PieChart as PieChartIcon } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState([
    { ticker: "MSFT", weight: 0.125, cost_basis: 285.40, current_price: 415.20, utility_score: 88 },
    { ticker: "AAPL", weight: 0.102, cost_basis: 150.25, current_price: 185.20, utility_score: 85 },
    { ticker: "GOOGL", weight: 0.098, cost_basis: 110.50, current_price: 145.80, utility_score: 82 },
    { ticker: "V", weight: 0.054, cost_basis: 220.10, current_price: 275.40, utility_score: 91 },
    { ticker: "CRM", weight: 0.048, cost_basis: 280.50, current_price: 295.20, utility_score: 89 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [optResult, setOptResult] = useState<any>(null);

  const sectorData = [
    { name: 'Technology', value: 45, color: 'var(--primary)' },
    { name: 'Financials', value: 22, color: '#2dd4bf' },
    { name: 'Healthcare', value: 15, color: '#99f6e4' },
    { name: 'Consumer Disc', value: 18, color: '#cbd5e1' },
  ];

  const runOptimization = async () => {
    setIsLoading(true);
    try {
      const payload = {
        holdings: holdings.map(h => ({
          ticker: h.ticker,
          weight: h.weight,
          cost_basis: h.cost_basis,
          current_price: h.current_price,
          utility_score: h.utility_score,
          // mock backend expected fields
          expected_return_score: h.utility_score,
          quality_score: h.utility_score,
          moat_score: h.utility_score,
          governance_score: h.utility_score,
          valuation_score: h.utility_score,
          volatility: 0.20
        }))
      };

      const data = await fetchApi('api/v1/portfolio/optimise', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setOptResult(data);
      
      // Update weights based on optimization result
      if (data.optimal_weights) {
        setHoldings(prev => prev.map(h => ({
          ...h,
          weight: data.optimal_weights[h.ticker] || h.weight
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portfolio Lab</h1>
          <p className="text-sm text-slate-500 mt-1">Growth & Quality Fund | Current Value: $12.4M</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 text-sm font-semibold rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
           <button className="px-4 py-2 text-sm font-semibold rounded bg-primary text-primary-foreground flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Position
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Return (YTD)</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-bold text-slate-900">+14.2%</p>
            <span className="flex items-center text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> vs SPX
            </span>
          </div>
        </div>
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weighted ROIC</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">24.5%</p>
        </div>
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sharpe Ratio</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{optResult ? optResult.expected_sharpe.toFixed(2) : "1.85"}</p>
        </div>
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Utility Score</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">82.4 / 100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
             <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Current Holdings</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right tabular-nums">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="text-left font-medium py-3 px-4">Ticker</th>
                  <th className="font-medium py-3 px-4">Weight</th>
                  <th className="font-medium py-3 px-4">Cost Basis</th>
                  <th className="font-medium py-3 px-4">Current Price</th>
                  <th className="font-medium py-3 px-4">Unrealized P&L</th>
                  <th className="font-medium py-3 px-4 text-primary">Utility Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holdings.map((h, i) => {
                  const pnl = ((h.current_price - h.cost_basis) / h.cost_basis) * 100;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="text-left py-3 px-4 font-bold text-slate-900">{h.ticker}</td>
                      <td className={`py-3 px-4 font-semibold ${optResult ? 'text-primary' : ''}`}>{(h.weight * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4">${h.cost_basis.toFixed(2)}</td>
                      <td className="py-3 px-4 font-semibold">${h.current_price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">+{pnl.toFixed(1)}%</td>
                      <td className="py-3 px-4 font-bold text-primary">{h.utility_score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2"><PieChartIcon className="w-4 h-4" /> Sector Allocation</span>
            </div>
            <div className="p-6 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Allocation']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-slate-100 p-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span>Technology</span></div>
                <span className="font-semibold text-slate-700">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-400"></div><span>Financials</span></div>
                <span className="font-semibold text-slate-700">22%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-200"></div><span>Healthcare</span></div>
                <span className="font-semibold text-slate-700">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div><span>Consumer Disc</span></div>
                <span className="font-semibold text-slate-700">18%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-md border border-slate-700 shadow-sm p-4">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2"><SlidersHorizontal className="w-4 h-4"/> Optimizer Engine</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Run robust optimization based on fundamental utility factors rather than purely Markowitz mean-variance.
            </p>
            <button 
              onClick={runOptimization}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Run Utility Optimization
            </button>
            {optResult && (
              <p className="mt-3 text-xs text-green-400 text-center">Weights successfully optimized via Max Sharpe proxy.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
