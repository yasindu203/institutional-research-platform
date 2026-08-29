import React from "react";
import { Calculator, BarChart3, TrendingUp, Settings2 } from "lucide-react";

export default function ValuationPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Valuation Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Apple Inc. (AAPL) | Base Scenario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Assumptions */}
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> DCF Assumptions
            </div>
            <div className="p-4 space-y-4">
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Terminal Growth Rate</span>
                  <span className="font-bold text-slate-900">2.5%</span>
                </div>
                <input type="range" className="w-full" min="0" max="5" step="0.1" defaultValue="2.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">WACC</span>
                  <span className="font-bold text-slate-900">8.2%</span>
                </div>
                <input type="range" className="w-full" min="5" max="15" step="0.1" defaultValue="8.2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Operating Margin (Yr 5)</span>
                  <span className="font-bold text-slate-900">31.5%</span>
                </div>
                <input type="range" className="w-full" min="20" max="40" step="0.5" defaultValue="31.5" />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-sm transition-colors">
                  Recalculate Model
                </button>
              </div>

            </div>
          </div>
          
          <div className="bg-slate-800 rounded-md border border-slate-700 shadow-sm p-5 text-white">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reverse DCF Implies</h3>
            <p className="text-sm leading-relaxed mt-2 text-slate-300">
              To justify the current market price of $185.20, AAPL must achieve <strong className="text-white">12.5% annualized FCF growth</strong> over the next 10 years, assuming an 8.2% WACC and 2.5% terminal rate.
            </p>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
               <span className="flex items-center gap-2"><Calculator className="w-4 h-4" /> Valuation Waterfall</span>
               <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded">USD Millions</span>
            </div>
            
            <div className="p-6">
              <table className="w-full text-sm">
                <tbody className="tabular-nums divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">Present Value of FCF (Years 1-5)</td>
                    <td className="py-3 px-4 text-right">485,250</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">Present Value of Terminal Value</td>
                    <td className="py-3 px-4 text-right">2,150,800</td>
                  </tr>
                  <tr className="bg-slate-50 border-y-2 border-slate-200">
                    <td className="py-3 px-4 font-bold text-slate-900">Implied Enterprise Value</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">2,636,050</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700 pl-8">Plus: Cash & Equivalents</td>
                    <td className="py-3 px-4 text-right text-green-700">166,543</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700 pl-8">Less: Total Debt</td>
                    <td className="py-3 px-4 text-right text-red-700">(109,280)</td>
                  </tr>
                  <tr className="bg-primary/5 border-t border-primary/20">
                    <td className="py-3 px-4 font-bold text-primary">Implied Equity Value</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">2,693,313</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-500 text-xs text-right">Divided by Shares Outstanding (Millions)</td>
                    <td className="py-3 px-4 text-right text-slate-500 text-xs">15,550</td>
                  </tr>
                  <tr className="bg-slate-900 text-white border-none rounded-b-md">
                    <td className="py-4 px-4 font-bold text-lg rounded-bl-md">Implied Share Price</td>
                    <td className="py-4 px-4 text-right font-bold text-2xl rounded-br-md">$173.20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
