import React from "react";
import { PieChart, Briefcase, Plus, Filter, SlidersHorizontal, ArrowUpRight } from "lucide-react";

export default function PortfolioPage() {
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
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weighted FCF Yield</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">4.1%</p>
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
                <tr className="hover:bg-slate-50/50">
                  <td className="text-left py-3 px-4 font-bold text-slate-900">MSFT</td>
                  <td className="py-3 px-4">12.5%</td>
                  <td className="py-3 px-4">$285.40</td>
                  <td className="py-3 px-4 font-semibold">$415.20</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">+45.4%</td>
                  <td className="py-3 px-4 font-bold text-primary">88</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="text-left py-3 px-4 font-bold text-slate-900">AAPL</td>
                  <td className="py-3 px-4">10.2%</td>
                  <td className="py-3 px-4">$150.25</td>
                  <td className="py-3 px-4 font-semibold">$185.20</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">+23.2%</td>
                  <td className="py-3 px-4 font-bold text-primary">85</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="text-left py-3 px-4 font-bold text-slate-900">GOOGL</td>
                  <td className="py-3 px-4">9.8%</td>
                  <td className="py-3 px-4">$110.50</td>
                  <td className="py-3 px-4 font-semibold">$145.80</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">+31.9%</td>
                  <td className="py-3 px-4 font-bold text-primary">82</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="text-left py-3 px-4 font-bold text-slate-900">V</td>
                  <td className="py-3 px-4">5.4%</td>
                  <td className="py-3 px-4">$220.10</td>
                  <td className="py-3 px-4 font-semibold">$275.40</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">+25.1%</td>
                  <td className="py-3 px-4 font-bold text-primary">91</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="text-left py-3 px-4 font-bold text-slate-900">CRM</td>
                  <td className="py-3 px-4">4.8%</td>
                  <td className="py-3 px-4">$280.50</td>
                  <td className="py-3 px-4 font-semibold">$295.20</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">+5.2%</td>
                  <td className="py-3 px-4 font-bold text-primary">89</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2"><PieChart className="w-4 h-4" /> Sector Allocation</span>
            </div>
            <div className="p-6 h-[250px] flex items-center justify-center bg-slate-50/30">
               <p className="text-slate-400 text-sm font-medium">Recharts PieChart renders here</p>
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
            <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded text-sm transition-colors">
              Run Utility Optimization
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
