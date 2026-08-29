"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TickerContextType {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

export function TickerProvider({ children }: { children: ReactNode }) {
  const [globalTicker, setGlobalTicker] = useState("AAPL");

  return (
    <TickerContext.Provider value={{ globalTicker, setGlobalTicker }}>
      {children}
    </TickerContext.Provider>
  );
}

export function useTicker() {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error("useTicker must be used within a TickerProvider");
  }
  return context;
}
