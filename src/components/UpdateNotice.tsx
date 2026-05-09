"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, Sparkles, X } from "lucide-react";

const VERSION = "2026.05b";
const STORAGE_KEY = `update-notice-seen-${VERSION}`;

const updates = [
  {
    icon: MessageCircle,
    title: "用户参与讨论",
    desc: "每轮结束后可以发言，哲学家会回应并引用你的观点",
  },
  {
    icon: Sparkles,
    title: "对话历史保存",
    desc: "讨论结束后一键保存，随时回看精彩对话",
  },
  {
    icon: Share2,
    title: "分享卡片",
    desc: "AI 提炼讨论精华，生成精美分享图，一键传播",
  },
];

export function UpdateNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-background/95 p-6 shadow-2xl glass-strong sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 text-center">
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {VERSION} 更新
              </span>
              <h2 className="text-2xl font-bold text-foreground">
                哲学圆桌会更新了
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                新版本带来了一些令人兴奋的变化
              </p>
            </div>

            <div className="mb-6 space-y-3">
              {updates.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-white/20 bg-white/5 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-sm font-medium text-foreground">
                目前处于测试阶段
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                我们非常希望收到你的反馈，一起把它做得更好
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full rounded-2xl bg-primary py-3 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              进入体验
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
