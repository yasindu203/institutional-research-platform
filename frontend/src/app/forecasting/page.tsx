import React from "react";
import { BrainCircuit, Play, BarChart2, Activity } from "lucide-react";

export default function ForecastingPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forecasting Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Apple Inc. (AAPL) | Horizon: 10 Years</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 text-sm font-semibold rounded bg-primary text-primary-foreground flex items-center gap-2">
            <Play className="w-4 h-4" /> Run ML Ensemble
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><BrainCircuit className="w-4 h-4"/> ML Model Selection</h3>
            <div className="space-y-3">
               <label className="flex items-center gap-2 text-sm text-slate-700">
                 <input type="radio" name="model" className="text-primary" /> Baseline (Historical CAGR)
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-700">
                 <input type="radio" name="model" defaultChecked className="text-primary" /> XGBoost (Macro + Fundamentals)
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-700">
                 <input type="radio" name="model" className="text-primary" /> ARIMA (Time-series only)
               </label>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Model Confidence (XGBoost)</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-700">High</span>
                <span className="text-xs text-slate-400">MAPE: 4.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 flex items-center justify-between">
             <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Revenue Forecast (Driver-Based)</span>
             <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded">USD Millions</span>
          </div>
          
          <div className="p-6 h-[400px] flex items-center justify-center border-b border-slate-100 bg-slate-50/30 relative">
             <p className="text-slate-400 font-medium">Chart visualization (Recharts Fan Chart will render here)</p>
             
             {/* Fake chart illustration using divs */}
             <div className="absolute bottom-10 left-10 right-10 top-10 flex items-end justify-between gap-1 opacity-60">
               <div className="w-full bg-slate-300 rounded-t-sm" style={{height: "30%"}}></div>
               <div className="w-full bg-slate-300 rounded-t-sm" style={{height: "35%"}}></div>
               <div className="w-full bg-slate-300 rounded-t-sm" style={{height: "45%"}}></div>
               <div className="w-full bg-slate-400 rounded-t-sm border-t-2 border-primary" style={{height: "50%"}}></div>
               <div className="w-full bg-slate-400 rounded-t-sm border-t-2 border-primary" style={{height: "55%"}}></div>
               <div className="w-full bg-slate-400 rounded-t-sm border-t-2 border-primary" style={{height: "65%"}}></div>
               <div className="w-full bg-primary/20 rounded-t-sm border-t-2 border-primary border-dashed" style={{height: "70%"}}></div>
               <div className="w-full bg-primary/20 rounded-t-sm border-t-2 border-primary border-dashed" style={{height: "75%"}}></div>
               <div className="w-full bg-primary/20 rounded-t-sm border-t-2 border-primary border-dashed" style={{height: "82%"}}></div>
             </div>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Explicit Period (Y1-Y5)</p>
              <p className="font-bold text-slate-900 mt-1">5.2% CAGR</p>
            </div>
            <div className="border-l border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase">Strategic Period (Y6-Y10)</p>
              <p className="font-bold text-slate-900 mt-1">3.1% CAGR</p>
            </div>
            <div className="border-l border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase">Terminal Growth</p>
              <p className="font-bold text-slate-900 mt-1">2.5%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
