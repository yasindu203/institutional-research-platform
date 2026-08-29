"use client";
import Link from "next/link";
import { Search, Bell, Settings, LayoutDashboard, FileText, Briefcase, LineChart, Cpu, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import { UploadModal } from "./UploadModal";

export function TopNav() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Cpu className="w-6 h-6" />
          <span>FIRS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 text-primary border-b-2 border-primary py-2">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/financials" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
            <FileText className="w-4 h-4" /> Financials
          </Link>
          <Link href="/governance" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
            <Briefcase className="w-4 h-4" /> Governance
          </Link>
          <Link href="/valuation" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
            <LineChart className="w-4 h-4" /> Valuation
          </Link>
          <Link href="/forecasting" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
            <TrendingUp className="w-4 h-4" /> Forecast
          </Link>
          <Link href="/portfolio" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
            <Briefcase className="w-4 h-4" /> Portfolio
          </Link>
          <Link href="/research" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
            <Cpu className="w-4 h-4" /> AI Analyst
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 font-semibold rounded-md text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>

        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search company (⌘K)"
            className="w-64 rounded-md border border-border bg-muted/50 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-sm ml-2">
          YM
        </div>
      </div>
      
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </nav>
  );
}
