"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Calculator, Settings2, Loader2, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useTicker } from "@/context/TickerContext";

export default function ValuationPage() {
  const { globalTicker } = useTicker();
  const [inputs, setInputs] = useState({
    base_fcf: 100000,
    terminal_growth_rate: 0.025,
    wacc: 0.082,
    net_debt: -57263, // AAPL roughly has more cash than debt -> net cash
    shares_outstanding: 15550,
    current_share_price: 185.20,
    fcf_growth_rates: [0.10, 0.09, 0.08, 0.07, 0.06]
  });

  const [dcfResult, setDcfResult] = useState<any>(null);
  const [reverseDcfResult, setReverseDcfResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateValuation = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dcf, revDcf] = await Promise.all([
        fetchApi('api/v1/valuation/dcf', {
          method: 'POST',
          body: JSON.stringify({
            base_fcf: inputs.base_fcf,
            fcf_growth_rates: inputs.fcf_growth_rates,
            terminal_growth_rate: inputs.terminal_growth_rate,
            wacc: inputs.wacc,
            net_debt: inputs.net_debt,
            shares_outstanding: inputs.shares_outstanding,
          })
        }),
        fetchApi('api/v1/valuation/reverse-dcf', {
          method: 'POST',
          body: JSON.stringify({
            current_share_price: inputs.current_share_price,
            shares_outstanding: inputs.shares_outstanding,
            net_debt: inputs.net_debt,
            base_fcf: inputs.base_fcf,
            wacc: inputs.wacc,
            terminal_growth_rate: inputs.terminal_growth_rate,
            forecast_years: 10
          })
        })
      ]);

      setDcfResult(dcf);
      setReverseDcfResult(revDcf);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputs]);

  // Run initial calculation
  useEffect(() => {
    calculateValuation();
  }, [calculateValuation]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Valuation Engine</h1>
          <p className="text-sm text-slate-500 mt-1">{globalTicker} Corporation ({globalTicker}) | Base Scenario (Mocked inputs for demo)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Assumptions */}
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> DCF Assumptions
            </div>
            <div className="p-4 space-y-5">
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Terminal Growth Rate</span>
                  <span className="font-bold text-slate-900">{(inputs.terminal_growth_rate * 100).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" className="w-full" min="0" max="0.05" step="0.001" 
                  value={inputs.terminal_growth_rate} 
                  onChange={e => handleSliderChange(e, 'terminal_growth_rate')} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">WACC</span>
                  <span className="font-bold text-slate-900">{(inputs.wacc * 100).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" className="w-full" min="0.05" max="0.15" step="0.001" 
                  value={inputs.wacc} 
                  onChange={e => handleSliderChange(e, 'wacc')} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Current Share Price ($)</span>
                  <span className="font-bold text-slate-900">{inputs.current_share_price.toFixed(2)}</span>
                </div>
                <input 
                  type="range" className="w-full" min="50" max="300" step="0.5" 
                  value={inputs.current_share_price} 
                  onChange={e => handleSliderChange(e, 'current_share_price')} 
                />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={calculateValuation}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded text-sm transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Recalculate Model
                </button>
              </div>

            </div>
          </div>
          
          <div className="bg-slate-800 rounded-md border border-slate-700 shadow-sm p-5 text-white">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reverse DCF Implies</h3>
            <p className="text-sm leading-relaxed mt-2 text-slate-300">
              {isLoading || !reverseDcfResult ? (
                "Calculating..."
              ) : reverseDcfResult.implied_fcf_growth_rate !== null ? (
                <>
                  To justify the current market price of ${inputs.current_share_price.toFixed(2)}, {globalTicker} must achieve <strong className="text-white">{(reverseDcfResult.implied_fcf_growth_rate * 100).toFixed(2)}% annualized FCF growth</strong> over the next 10 years, assuming a {(inputs.wacc * 100).toFixed(1)}% WACC and {(inputs.terminal_growth_rate * 100).toFixed(1)}% terminal rate.
                </>
              ) : (
                "Could not calculate implied growth (price may be too high to justify within normal constraints)."
              )}
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
              {isLoading || !dcfResult ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="tabular-nums divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700">Present Value of FCF (Years 1-5)</td>
                      <td className="py-3 px-4 text-right">{Math.round(dcfResult.pv_sum).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700">Present Value of Terminal Value</td>
                      <td className="py-3 px-4 text-right">{Math.round(dcfResult.pv_tv).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50 border-y-2 border-slate-200">
                      <td className="py-3 px-4 font-bold text-slate-900">Implied Enterprise Value</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">{Math.round(dcfResult.enterprise_value).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700 pl-8">Less: Net Debt (Negative = Net Cash)</td>
                      <td className="py-3 px-4 text-right text-red-700">{(inputs.net_debt).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-primary/5 border-t border-primary/20">
                      <td className="py-3 px-4 font-bold text-primary">Implied Equity Value</td>
                      <td className="py-3 px-4 text-right font-bold text-primary">{Math.round(dcfResult.equity_value).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-500 text-xs text-right">Divided by Shares Outstanding (Millions)</td>
                      <td className="py-3 px-4 text-right text-slate-500 text-xs">{inputs.shares_outstanding.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-900 text-white border-none rounded-b-md">
                      <td className="py-4 px-4 font-bold text-lg rounded-bl-md">Implied Share Price</td>
                      <td className="py-4 px-4 text-right font-bold text-2xl rounded-br-md">${dcfResult.implied_share_price.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
