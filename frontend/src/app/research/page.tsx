"use client";
import React, { useState } from "react";
import { MessageSquare, Sparkles, FileText, Send, Loader2, Zap } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useTicker } from "@/context/TickerContext";

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export default function ResearchPage() {
  const { globalTicker } = useTicker();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `I am connected to the FIRS Research Engine. I'm ready to analyze ${globalTicker}. Ask me about the company's moat, financials, risks, or anything else.`,
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const SUGGESTED_PROMPTS = [
    `What is ${globalTicker}'s competitive moat?`,
    `What are the key risks for ${globalTicker}?`,
    `Search latest ${globalTicker} news`,
    `How does ${globalTicker} generate revenue?`,
    `What could invalidate the ${globalTicker} bull thesis?`,
  ];

  const handleSend = async (overrideInput?: string) => {
    const query = overrideInput ?? input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let context = "";
      if (userMessage.content.toLowerCase().includes("search") || userMessage.content.toLowerCase().includes("latest")) {
        setMessages(prev => [...prev, { id: 'search-status', role: 'ai', content: 'Searching the web via Tavily...' }]);
        const searchData = await fetchApi('api/v1/research/web-search', {
          method: 'POST',
          body: JSON.stringify({ query: userMessage.content, max_results: 3 })
        });
        if (searchData.results) {
          context = "Web Search Results:\\n" + searchData.results.map((r: any) => `Source: ${r.title}\\nContent: ${r.content}`).join('\\n\\n');
          setSources(searchData.results);
        }
        setMessages(prev => prev.filter(m => m.id !== 'search-status'));
      }

      const data = await fetchApi('api/v1/research/query', {
        method: 'POST',
        body: JSON.stringify({ query: userMessage.content, context: context || undefined, task_type: "rag_qa" }),
      });

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: data.content }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-background">
      {/* Left Sidebar - Sources */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border font-semibold text-slate-800">
          Recent Web Sources
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sources.length === 0 ? (
            <p className="text-sm text-slate-500">No sources retrieved yet.</p>
          ) : (
            sources.map((s, idx) => (
              <SourceItem key={idx} title={s.title} date="Just now" type={s.reliability_tier || "Web"} url={s.url} />
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white font-bold text-xs' : 'bg-primary text-white'}`}>
                {msg.role === 'user' ? 'YM' : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`rounded-lg p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-sm text-slate-700 leading-relaxed flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" /> Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          {/* Suggested Prompts */}
          <div className="max-w-4xl mx-auto mb-3 flex gap-2 flex-wrap">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40"
              >
                <Zap className="w-3 h-3" />
                {prompt}
              </button>
            ))}
          </div>
          <div className="max-w-4xl mx-auto relative flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask the AI Analyst (grounded strictly in extracted evidence)..." 
              className="w-full border border-slate-300 rounded-lg pl-4 pr-12 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 bg-primary text-white rounded p-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceItem({ title, date, type, url }: { title: string, date: string, type: string, url?: string }) {
  return (
    <div 
      className="bg-slate-50 border border-slate-200 rounded p-3 cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => url && window.open(url, '_blank')}
    >
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
