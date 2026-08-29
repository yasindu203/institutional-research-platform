"use client";

import React, { useState } from "react";
import { Upload, X, FileText, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useTicker } from "@/context/TickerContext";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { setGlobalTicker } = useTicker();
  const [ticker, setTicker] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !file) return;

    setStatus("uploading");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetchApi(`api/v1/financials/upload/${ticker}`, {
        method: "POST",
        body: formData,
      });
      setStatus("success");
      setMessage(res.message || "Data extracted successfully.");
      setGlobalTicker(ticker.toUpperCase());
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to upload and extract data. The backend might be sleeping or unreachable.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" /> Upload 10-K / 10-Q Report
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900 text-lg mb-2">Ingestion Complete!</h3>
              <p className="text-sm text-slate-500 mb-6">{message}</p>
              <button 
                onClick={onClose}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-5">
              
              {status === "error" && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm flex gap-2 items-start border border-red-100">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Ticker</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. NVDA"
                  value={ticker}
                  onChange={e => setTicker(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEC Filing (PDF)</label>
                <div className="border-2 border-dashed border-slate-200 rounded p-6 text-center hover:bg-slate-50 transition-colors">
                  <input 
                    type="file" 
                    required
                    accept=".pdf"
                    id="file-upload"
                    className="hidden"
                    onChange={e => e.target.files && setFile(e.target.files[0])}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <FileText className={`w-8 h-8 mb-2 ${file ? 'text-primary' : 'text-slate-400'}`} />
                    <span className="text-sm font-semibold text-slate-700">
                      {file ? file.name : "Click to select PDF"}
                    </span>
                    {!file && <span className="text-xs text-slate-500 mt-1">Maximum size 50MB</span>}
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === "uploading" || !file || !ticker}
                className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {status === "uploading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing OCR pipeline...</>
                ) : (
                  <>Start Ingestion & Extraction</>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400 leading-tight">
                * Note: Currently runs in fast-simulation mode. This parses the PDF and matches it against standard SEC templated schemas.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
