"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Bot,
  User,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import {
  AUTOMATED_FAQS,
  type ChatAction,
  type ChatMessage,
  type AutomatedFaq,
} from "@/lib/chat-knowledge";
import type { OrderDraft } from "@/lib/order";
import { PRICING } from "@/lib/pricing";

interface ChatConciergeProps {
  onOpenOrder: (draft?: Partial<OrderDraft>) => void;
  onSelectLanguage?: (sourceLang: string, targetLang?: string) => void;
}

export const ChatConcierge: React.FC<ChatConciergeProps> = ({ onOpenOrder, onSelectLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTeaser, setShowTeaser] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "faqs">("faqs");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      scrollToBottom();
      setHasUnread(false);
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, activeTab]);

  // Hide teaser after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectFaq = (faq: AutomatedFaq) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: faq.question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: "assistant",
      text: faq.answer,
      action: faq.action,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setActiveTab("chat");
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setActiveTab("chat");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: data.text || "Here is the information you requested.",
        action: data.action,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: `Yes! Every certified translation is **100% Guaranteed for USCIS Acceptance** under 8 CFR 204.2, prepared at **$${PRICING.pricePerPage.toFixed(2)}/page** with standard 24-hour turnaround.\n\nWe provide signed & stamped Certificates of Accuracy accepted by USCIS, courts, WES, and academic institutions worldwide.`,
        action: {
          type: "open_order",
          label: `Start Certified Order ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
          payload: { serviceType: "certified", pages: 1 },
        },
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.type === "open_order" && action.payload) {
      if (action.payload.sourceLang && onSelectLanguage) {
        onSelectLanguage(action.payload.sourceLang, action.payload.targetLang || "English");
      }
      onOpenOrder(action.payload);
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setActiveTab("faqs");
  };

  // Helper to format basic markdown (*bold* and bullet points)
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lineIdx} className="block min-h-[1.2em]">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-extrabold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Bottom-Right Launcher */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Unobtrusive Teaser Bubble */}
        {!isOpen && showTeaser && (
          <div
            onClick={() => {
              setIsOpen(true);
              setActiveTab("faqs");
            }}
            className="mb-2.5 max-w-[250px] bg-white border border-slate-200 p-3 rounded-2xl shadow-xl cursor-pointer hover:border-teal-400 hover:shadow-2xl transition-all flex items-start gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 text-[#173d40]">
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                Have questions or need a quick quote?
              </p>
              <span className="text-[11px] text-teal-800 font-semibold mt-0.5 block">
                Instant Automated Answers →
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 ml-auto"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Circular Launch Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Translation Assistant" : "Open AI Translation Assistant"}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            isOpen
              ? "bg-slate-800 text-white rotate-90"
              : "bg-gradient-to-br from-[#173d40] to-[#0f2729] text-white hover:scale-105 shadow-[#173d40]/30"
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {hasUnread && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-pulse" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Main Compact Docked Window (Anchored in bottom-right corner) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Translation Concierge & Instant Answers"
          className="fixed bottom-20 right-3 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[480px] max-h-[72vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-modal-in"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#173d40] via-[#1a474b] to-[#123032] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#173d40] rounded-full" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold leading-tight">Linguist Point Concierge</h3>
                <p className="text-[10px] text-teal-100/80 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  Instant Automated Answers &amp; Quotes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart & View Topics"
                className="p-1.5 text-teal-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Restart Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="p-1.5 text-teal-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Navigation Tabs */}
          <div className="bg-slate-100/80 p-1 flex border-b border-slate-200/80 flex-shrink-0">
            <button
              onClick={() => setActiveTab("faqs")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "faqs"
                  ? "bg-white text-[#173d40] shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Answers</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "chat"
                  ? "bg-white text-[#173d40] shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Ask Custom Question</span>
            </button>
          </div>

          {/* Content Body: Tab 1 - Instant Answers Hub */}
          {activeTab === "faqs" && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50/50">
              <div className="bg-white border border-teal-100 rounded-xl p-3 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Instant Knowledge Hub
                </span>
                <p className="text-xs text-slate-700 font-semibold mt-1.5">
                  Select any question below for immediate automated answers:
                </p>
              </div>

              <div className="space-y-1.5">
                {AUTOMATED_FAQS.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleSelectFaq(faq)}
                    className="w-full text-left bg-white hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-400 p-3 rounded-xl transition-all shadow-2xs flex items-center justify-between gap-2.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">{faq.icon}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {faq.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#173d40] transition-colors truncate block">
                          {faq.question}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#173d40] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Body: Tab 2 - Interactive Chat Stream */}
          {activeTab === "chat" && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/40">
              {messages.length === 0 ? (
                <div className="text-center py-8 px-4 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-[#173d40] flex items-center justify-center mx-auto border border-teal-200">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Ask Any Question</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Type a question below about USCIS acceptance, pricing, delivery speed, or specific languages to receive an instant automated answer.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-[#173d40] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-[#173d40]" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                          isUser
                            ? "bg-[#173d40] text-white rounded-tr-xs"
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-xs"
                        }`}
                      >
                        {!isUser && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-100">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Answer</span>
                          </div>
                        )}

                        <div>{renderFormattedText(msg.text)}</div>

                        {/* Optional Action Button */}
                        {msg.action && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleActionClick(msg.action!)}
                              className="w-full bg-[#173d40] hover:bg-[#123032] text-white font-extrabold text-[11px] px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                            >
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>{msg.action.label}</span>
                              <ArrowRight className="w-3 h-3 ml-auto" />
                            </button>
                          </div>
                        )}

                        <span
                          className={`text-[9px] block mt-1 ${
                            isUser ? "text-teal-200/75 text-right" : "text-slate-400"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-[#173d40] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#173d40]" />
                  </div>
                  <div className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-2xl rounded-tl-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Input Bar at Bottom (Always Available) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask any question (e.g. USCIS, pricing, speed)…"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-8 h-8 bg-[#173d40] hover:bg-[#123032] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
              aria-label="Send question"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
