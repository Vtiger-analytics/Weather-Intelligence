import React, { useState } from 'react';
import { Sparkles, Bot, Send, RefreshCw, AlertCircle, ShieldCheck, MessageSquare, X, Loader2 } from 'lucide-react';
import { FullWeatherData, AIBriefingResponse } from '../types';
import { askAIChat } from '../services/weatherApi';

interface AIBriefingCardProps {
  briefing: AIBriefingResponse | null;
  isLoadingBriefing: boolean;
  onRefreshBriefing: () => void;
  weatherData: FullWeatherData;
}

export const AIBriefingCard: React.FC<AIBriefingCardProps> = ({
  briefing,
  isLoadingBriefing,
  onRefreshBriefing,
  weatherData
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am AeroIntel, your AI Weather Assistant. Ask me anything about today's forecast for ${weatherData.location.name}, trip planning, or activity timing!`
    }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsSendingChat(true);

    const reply = await askAIChat(userMsg, weatherData);

    setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    setIsSendingChat(false);
  };

  return (
    <div className="p-6 lg:p-7 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-sky-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-md shadow-sky-500/10">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
                AI Weather Intelligence Briefing
              </h3>
              {briefing?.isAiGenerated && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Gemini 3.6 Flash
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Synthesized meteorological intelligence & actionable planning summary</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            id="btn-ask-weather-ai"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AeroIntel AI</span>
          </button>

          <button
            onClick={onRefreshBriefing}
            disabled={isLoadingBriefing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Re-generate AI Briefing"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${isLoadingBriefing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Briefing Content */}
      {isLoadingBriefing ? (
        <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          Analyzing atmospheric conditions with Gemini AI...
        </div>
      ) : briefing ? (
        <div className="mt-5 space-y-4">
          
          {/* Headline Alert if exists */}
          {briefing.headlineAlert && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-semibold">{briefing.headlineAlert}</span>
            </div>
          )}

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              "{briefing.executiveSummary}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Safety Score Meter */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>Outdoor Suitability Score</span>
                <ShieldCheck className="w-4 h-4 text-sky-400" />
              </div>

              <div className="my-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-100">{briefing.outdoorSafetyScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    briefing.outdoorSafetyScore >= 80 ? 'bg-emerald-400' : briefing.outdoorSafetyScore >= 50 ? 'bg-sky-400' : 'bg-rose-500'
                  }`} 
                  style={{ width: `${briefing.outdoorSafetyScore}%` }} 
                />
              </div>
            </div>

            {/* Smart Action Tips */}
            <div className="md:col-span-8 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Actionable Planning Tips
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {briefing.smartTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      ) : null}

      {/* Interactive AI Chat Drawer / Modal */}
      {isChatOpen && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">AeroIntel Weather Assistant</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="max-h-56 overflow-y-auto space-y-2.5 p-2 scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-500 text-slate-950 font-medium rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isSendingChat && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 p-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                AeroIntel is analyzing...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask e.g. 'Is 5 PM good for a run in Tokyo today?'"
              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-sky-500/80"
              id="ai-chat-input"
            />
            <button
              type="submit"
              disabled={isSendingChat || !chatInput.trim()}
              className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
              id="btn-send-ai-chat"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
