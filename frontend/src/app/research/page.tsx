import React from "react";
import { MessageSquare, Sparkles, FileText, Send, Link as LinkIcon } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="flex h-[calc(100vh-65px)] bg-background">
      {/* Left Sidebar - Sources */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border font-semibold text-slate-800">
          Source Ledger (Tier 1)
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <SourceItem title="AAPL 10-K (2023)" date="Oct 2023" type="SEC EDGAR" />
          <SourceItem title="AAPL 10-Q (Q1 2024)" date="Jan 2024" type="SEC EDGAR" />
          <SourceItem title="Earnings Call Transcript" date="Jan 2024" type="Investor Relations" />
          <SourceItem title="Proxy Statement (DEF 14A)" date="Jan 2024" type="SEC EDGAR" />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-sm text-slate-700 leading-relaxed">
              <p>I have analyzed Apple's recent filings and financial data. How can I help you today? You can ask me to explain revenue growth, find related-party transactions, or run a Socratic challenge on your thesis.</p>
            </div>
          </div>

          <div className="flex gap-4 max-w-4xl mx-auto flex-row-reverse">
            <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              YM
            </div>
            <div className="bg-slate-800 text-white rounded-lg p-4 shadow-sm text-sm leading-relaxed">
              <p>What were the primary drivers for gross margin expansion in Q1 2024?</p>
            </div>
          </div>

          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-sm text-slate-700 leading-relaxed space-y-3">
              <p>In Q1 2024, Apple's gross margin expanded to 45.9% (up from 43.0% in Q1 2023). This expansion was driven by two primary factors:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Favorable Product Mix:</strong> A higher proportion of Services revenue, which carries a 72.8% gross margin compared to Products at 39.4% <sup className="text-primary font-bold cursor-pointer hover:underline">[1]</sup>.</li>
                <li><strong>Component Cost Savings:</strong> Management noted leverage from lower memory and NAND pricing during the earnings call <sup className="text-primary font-bold cursor-pointer hover:underline">[2]</sup>.</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center gap-1 border border-slate-200"><LinkIcon className="w-3 h-3"/> [1] AAPL 10-Q (Q1 2024), Page 24</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center gap-1 border border-slate-200"><LinkIcon className="w-3 h-3"/> [2] Q1 2024 Earnings Transcript</span>
              </div>
            </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Ask the AI Analyst (grounded strictly in extracted evidence)..." 
              className="w-full border border-slate-300 rounded-lg pl-4 pr-12 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-primary text-white rounded p-2 hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceItem({ title, date, type }: { title: string, date: string, type: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded p-3 cursor-pointer hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <FileText className="w-3.5 h-3.5 text-slate-400" />
        <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">{title}</h4>
      </div>
      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
        <span className="font-medium px-1.5 py-0.5 bg-slate-200 rounded">{type}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}
