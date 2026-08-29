"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, LayoutDashboard, FileText, Briefcase, LineChart, Cpu, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import { UploadModal } from "./UploadModal";
import { useTicker } from "@/context/TickerContext";

export function TopNav() {
  const pathname = usePathname();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { setGlobalTicker } = useTicker();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim()) {
      setGlobalTicker(searchInput.trim().toUpperCase());
      setSearchInput("");
    }
  };

  const showToast = (feature: string) => {
    alert(`${feature} feature coming in Phase 11.`);
  };

  const navLinks = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Financials", href: "/financials", icon: FileText },
    { name: "Governance", href: "/governance", icon: Briefcase },
    { name: "Valuation", href: "/valuation", icon: LineChart },
    { name: "Forecast", href: "/forecasting", icon: TrendingUp },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "AI Analyst", href: "/research", icon: Cpu },
  ];

  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Cpu className="w-6 h-6" />
          <span>FIRS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-2 py-2 transition-colors ${
                  isActive 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" /> {link.name}
              </Link>
            );
          })}
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search global ticker (⌘K)"
            className="w-64 rounded-md border border-border bg-muted/50 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary uppercase placeholder:normal-case"
          />
        </div>
        <button onClick={() => showToast('Notifications')} className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted">
          <Bell className="w-5 h-5" />
        </button>
        <button onClick={() => showToast('Settings')} className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted">
          <Settings className="w-5 h-5" />
        </button>
        <button onClick={() => showToast('User Profile')} className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-sm ml-2">
          YM
        </button>
      </div>
      
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </nav>
  );
}
