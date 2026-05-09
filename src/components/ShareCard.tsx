"use client";

import { useCallback, useRef, useState } from "react";
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
}

const SITE_URL = "https://philosophy-roundtable.1417541455.workers.dev";

function getPhilosopherHighlight(
  philosopher: Philosopher,
  messages: Message[],
): string {
  const philosopherMessages = messages.filter(
    (m) => m.philosopherId === philosopher.id && m.phase !== "narrator",
  );
  if (philosopherMessages.length === 0) return "";
  const last = philosopherMessages[philosopherMessages.length - 1];
  return last.content.length > 80
    ? last.content.slice(0, 80) + "…"
    : last.content;
}

function getNarratorSummary(messages: Message[]): string {
  const narratorMessages = messages.filter((m) => m.phase === "narrator");
  if (narratorMessages.length === 0) return "";
  return narratorMessages[narratorMessages.length - 1].content;
}

export function ShareCard({
  topic,
  philosophers,
  messages,
  onClose,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `哲学圆桌会-${topic.slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate share image:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [topic]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

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
      console.error("Failed to share:", err);
      setIsGenerating(false);
    }
  }, [topic]);

  const summary = getNarratorSummary(messages);

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
          className="flex max-h-[90vh] flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={cardRef}
            className="w-[380px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-7 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="mb-5 text-center">
              <p className="mb-1 text-xs tracking-[0.2em] text-indigo-300/70">
                PHILOSOPHY ROUNDTABLE
              </p>
              <h1 className="text-2xl font-bold tracking-tight">哲学圆桌会</h1>
            </div>

            {/* Topic */}
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-xs text-indigo-300/70">本期话题</p>
              <p className="mt-1 text-base font-semibold leading-relaxed">
                {topic}
              </p>
            </div>

            {/* Philosophers */}
            <div className="mb-5">
              <div className="flex justify-center gap-3">
                {philosophers.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">
                      {p.avatar}
                    </div>
                    <span className="text-xs text-white/70">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-5 space-y-2.5">
              {philosophers.map((p) => {
                const highlight = getPhilosopherHighlight(p, messages);
                if (!highlight) return null;
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5"
                  >
                    <span className="text-xs font-semibold text-indigo-300">
                      {p.name}
                    </span>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/85">
                      {highlight}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {summary && (
              <div className="mb-5 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-center">
                <p className="text-xs text-indigo-300/70">讨论总结</p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">
                  {summary}
                </p>
              </div>
            )}

            {/* Footer with URL + QR */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-indigo-300">
                  扫码体验哲学对话
                </p>
                <p className="mt-0.5 text-xs text-white/50">{SITE_URL}</p>
              </div>
              <div className="rounded-lg bg-white p-1">
                <QRCodeSVG
                  value={SITE_URL}
                  size={56}
                  bgColor="#ffffff"
                  fgColor="#1e1b4b"
                  level="M"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
              disabled={isGenerating}
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
              disabled={isGenerating}
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
