"use client";
import React, { useState, useEffect } from "react";
import { BrainCircuit, Play, BarChart2, Activity, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useTicker } from "@/context/TickerContext";

export default function ForecastingPage() {
  const { globalTicker } = useTicker();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState("ensemble");

  const runForecast = async () => {
    setIsLoading(true);
    try {
      let endpoint = 'api/v1/forecast/ensemble';
      let payload: any = {
        historical_revenue: [274515, 365817, 394328, 383285, 388400],
        base_revenue: 388400,
        revenue_growth_rates: [0.05, 0.05, 0.04, 0.04, 0.03],
        gross_margin_pct: 0.44,
        ebit_margin_pct: 0.30,
        tax_rate: 0.16,
        reinvestment_rate: 0.25,
      };

      if (modelType === "baseline") {
        endpoint = 'api/v1/forecast/baseline';
        payload = { historical_values: payload.historical_revenue, years_to_forecast: 5 };
      } else if (modelType === "driver") {
        endpoint = 'api/v1/forecast/driver-based';
      } else {
        payload.baseline_weight = 0.3;
        payload.driver_weight = 0.7;
      }

      const data = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runForecast();
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forecasting Engine</h1>
          <p className="text-sm text-slate-500 mt-1">{globalTicker} Corporation ({globalTicker}) | Horizon: 5 Years</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={runForecast}
             disabled={isLoading}
             className="px-4 py-2 text-sm font-semibold rounded bg-primary text-primary-foreground flex items-center gap-2 disabled:opacity-50"
            >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} 
            Run Forecast
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><BrainCircuit className="w-4 h-4"/> ML Model Selection</h3>
            <div className="space-y-3">
               <label className="flex items-center gap-2 text-sm text-slate-700">
                 <input type="radio" name="model" checked={modelType === "baseline"} onChange={() => setModelType("baseline")} className="text-primary" /> Baseline (Historical CAGR)
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-700">
                 <input type="radio" name="model" checked={modelType === "driver"} onChange={() => setModelType("driver")} className="text-primary" /> Driver-Based (Fundamentals)
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-700">
                 <input type="radio" name="model" checked={modelType === "ensemble"} onChange={() => setModelType("ensemble")} className="text-primary" /> Ensemble (Weighted Blend)
               </label>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Model Confidence</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-700">High</span>
                <span className="text-xs text-slate-400">MAPE: ~4.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
             <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Revenue Forecast Data</span>
             <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded">USD Millions</span>
          </div>
          
          <div className="p-6 overflow-x-auto">
            {isLoading || !result ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <table className="w-full text-sm text-right tabular-nums">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-2 px-4">Metric</th>
                    <th className="py-2 px-4">Year 1</th>
                    <th className="py-2 px-4">Year 2</th>
                    <th className="py-2 px-4">Year 3</th>
                    <th className="py-2 px-4">Year 4</th>
                    <th className="py-2 px-4">Year 5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modelType === "ensemble" ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="text-left py-3 px-4 font-bold text-slate-800">Ensemble Forecast</td>
                        {result.ensemble_forecast.map((val: number, i: number) => <td key={i} className="py-3 px-4 font-bold">{Math.round(val).toLocaleString()}</td>)}
                      </tr>
                      <tr className="hover:bg-slate-50 text-slate-500 text-xs">
                        <td className="text-left py-2 px-4">(Baseline Component)</td>
                        {result.baseline_component.map((val: number, i: number) => <td key={i} className="py-2 px-4">{Math.round(val).toLocaleString()}</td>)}
                      </tr>
                      <tr className="hover:bg-slate-50 text-slate-500 text-xs">
                        <td className="text-left py-2 px-4">(Driver Component)</td>
                        {result.driver_component.map((val: number, i: number) => <td key={i} className="py-2 px-4">{Math.round(val).toLocaleString()}</td>)}
                      </tr>
                    </>
                  ) : modelType === "baseline" ? (
                    <tr className="hover:bg-slate-50">
                      <td className="text-left py-3 px-4 font-bold text-slate-800">Projected Value</td>
                      {result.projected_values.map((val: number, i: number) => <td key={i} className="py-3 px-4 font-bold">{Math.round(val).toLocaleString()}</td>)}
                    </tr>
                  ) : (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="text-left py-3 px-4 font-semibold">Revenue</td>
                        {result.map((r: any, i: number) => <td key={i} className="py-3 px-4">{Math.round(r.revenue).toLocaleString()}</td>)}
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="text-left py-2 px-4 text-slate-600">FCF</td>
                        {result.map((r: any, i: number) => <td key={i} className="py-2 px-4">{Math.round(r.fcf).toLocaleString()}</td>)}
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 grid grid-cols-2 gap-4 text-center border-t border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Selected Model</p>
              <p className="font-bold text-slate-900 mt-1 uppercase">{modelType}</p>
            </div>
            <div className="border-l border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase">Historical CAGR (Baseline)</p>
              <p className="font-bold text-slate-900 mt-1">9.05%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
