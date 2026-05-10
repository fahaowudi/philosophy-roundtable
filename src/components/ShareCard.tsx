"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas-pro";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Share2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Message, Philosopher } from "@/types/discussion";

interface ShareCardProps {
  topic: string;
  philosophers: Philosopher[];
  messages: Message[];
  onClose: () => void;
  onImageGenerated?: (imageData: string) => void;
}

const SITE_URL = "https://philosophy-roundtable.1417541455.workers.dev";

interface PhilosopherSummary {
  id: string;
  name: string;
  summary: string;
}

interface SummaryData {
  philosophers: PhilosopherSummary[];
  conclusion: string;
}

const COLOR_MAP: Record<string, string> = {
  "bg-blue-500": "#3b82f6",
  "bg-purple-500": "#a855f7",
  "bg-amber-500": "#f59e0b",
  "bg-red-500": "#ef4444",
  "bg-teal-500": "#14b8a6",
};

const COLOR_MAP_LIGHT: Record<string, string> = {
  "bg-blue-500": "#93c5fd",
  "bg-purple-500": "#d8b4fe",
  "bg-amber-500": "#fcd34d",
  "bg-red-500": "#fca5a5",
  "bg-teal-500": "#5eead4",
};

async function captureCard(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    scale: 2,
    backgroundColor: "#0f0e1a",
    useCORS: true,
    allowTaint: false,
    logging: false,
  });
}

export function ShareCard({
  topic,
  philosophers,
  messages,
  onClose,
  onImageGenerated,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            messages,
            philosophers: philosophers.map((p) => ({ id: p.id, name: p.name })),
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch summary");
        const data: SummaryData = await res.json();
        setSummaryData(data);
      } catch (err) {
        console.error("Summary fetch error:", err);
        setError("总结生成失败，请重试");
      } finally {
        setIsLoadingSummary(false);
      }
    }

    fetchSummary();
  }, [topic, messages, philosophers]);

  useEffect(() => {
    if (!summaryData || !cardRef.current || !onImageGenerated) return;
    const timer = setTimeout(async () => {
      try {
        const canvas = await captureCard(cardRef.current!);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        onImageGenerated(dataUrl);
      } catch (err) {
        console.error("Auto-capture failed:", err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [summaryData, onImageGenerated]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await captureCard(cardRef.current);
      const link = document.createElement("a");
      link.download = `哲学圆桌会-${topic.slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [topic]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await captureCard(cardRef.current);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.share({
            title: "哲学圆桌会",
            text: topic,
            files: [
              new File([blob], "philosophy-roundtable.png", {
                type: "image/png",
              }),
            ],
          });
        } catch {
          const link = document.createElement("a");
          link.download = `哲学圆桌会-${topic.slice(0, 10)}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        setIsGenerating(false);
      }, "image/png");
    } catch (err) {
      console.error("Share failed:", err);
      setIsGenerating(false);
    }
  }, [topic]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex max-h-[90vh] flex-col items-center gap-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Share Card */}
          <div
            ref={cardRef}
            className="w-[400px] rounded-3xl p-6"
            style={{
              background:
                "linear-gradient(135deg, #0f0e1a 0%, #1a1a2e 40%, #16213e 100%)",
            }}
          >
            {/* Header */}
            <div className="mb-4 text-center">
              <p
                className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: "#93c5fd" }}
              >
                Philosophy Roundtable
              </p>
              <h1 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>
                哲学圆桌会
              </h1>
            </div>

            {/* Topic */}
            <div
              className="mb-4 rounded-2xl border px-4 py-3 text-center"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <p className="text-[11px]" style={{ color: "#93c5fd" }}>
                本期话题
              </p>
              <p
                className="mt-1 text-[15px] font-semibold leading-relaxed"
                style={{ color: "#e2e8f0" }}
              >
                {topic}
              </p>
            </div>

            {/* Philosopher Avatars Row */}
            <div className="mb-4 flex justify-center gap-4">
              {philosophers.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-1.5">
                  <div
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
                    style={{
                      border: `2px solid ${COLOR_MAP[p.color] || "#3b82f6"}`,
                      background: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: COLOR_MAP_LIGHT[p.color] || "#93c5fd" }}
                  >
                    {p.name}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Summary Content */}
            {isLoadingSummary ? (
              <div className="mb-4 flex flex-col items-center gap-2 py-6">
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: "#93c5fd" }}
                />
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                  正在提炼对话精华...
                </p>
              </div>
            ) : error ? (
              <div className="mb-4 py-4 text-center">
                <p className="text-xs" style={{ color: "#fca5a5" }}>
                  {error}
                </p>
              </div>
            ) : (
              summaryData && (
                <>
                  {/* Philosopher Summaries */}
                  <div className="mb-3 space-y-2">
                    {summaryData.philosophers.map((ps, i) => {
                      const p = philosophers.find((ph) => ph.id === ps.id);
                      const color =
                        COLOR_MAP[p?.color || "bg-blue-500"] || "#3b82f6";
                      const lightColor =
                        COLOR_MAP_LIGHT[p?.color || "bg-blue-500"] || "#93c5fd";
                      return (
                        <div
                          key={ps.id}
                          className="rounded-xl border px-3.5 py-2.5"
                          style={{
                            borderColor: `${color}33`,
                            background: `${color}0d`,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full"
                              style={{ border: `1.5px solid ${color}` }}
                            >
                              {p && (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: lightColor }}
                            >
                              {ps.name}
                            </span>
                          </div>
                          <p
                            className="mt-1.5 text-[12.5px] leading-relaxed"
                            style={{ color: "rgba(226,232,240,0.9)" }}
                          >
                            {ps.summary}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Conclusion */}
                  {summaryData.conclusion && (
                    <div
                      className="mb-4 rounded-xl border px-4 py-3 text-center"
                      style={{
                        borderColor: "rgba(147,197,253,0.2)",
                        background: "rgba(147,197,253,0.06)",
                      }}
                    >
                      <p
                        className="text-[11px] font-medium"
                        style={{ color: "#93c5fd" }}
                      >
                        讨论总结
                      </p>
                      <p
                        className="mt-1 text-[12.5px] leading-relaxed"
                        style={{ color: "rgba(226,232,240,0.9)" }}
                      >
                        {summaryData.conclusion}
                      </p>
                    </div>
                  )}
                </>
              )
            )}

            {/* Footer: URL + QR */}
            <div
              className="flex items-center justify-between rounded-xl border px-4 py-3"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div>
                <p
                  className="text-[11px] font-semibold"
                  style={{ color: "#93c5fd" }}
                >
                  扫码体验哲学对话
                </p>
                <p
                  className="mt-0.5 text-[10px]"
                  style={{ color: "rgba(148,163,184,0.6)" }}
                >
                  {SITE_URL}
                </p>
              </div>
              <div className="rounded-lg bg-white p-1">
                <QRCodeSVG
                  value={SITE_URL}
                  size={52}
                  bgColor="#ffffff"
                  fgColor="#1e1b4b"
                  level="M"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="mr-1.5 h-4 w-4" />
              关闭
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isGenerating || isLoadingSummary}
              className="rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
            >
              {isGenerating ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}
              保存图片
            </Button>
            <Button
              onClick={handleShare}
              disabled={isGenerating || isLoadingSummary}
              className="rounded-full bg-indigo-500 text-white hover:bg-indigo-400"
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              分享
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
