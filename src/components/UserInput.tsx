"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserInputProps {
  onSubmit: (content: string) => void;
  onSkip: () => void;
}

export function UserInput({ onSubmit, onSkip }: UserInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="mt-4 rounded-2xl border border-white/40 p-4 glass-strong shadow-glass"
    >
      <p className="mb-3 text-sm font-medium text-primary/80">
        你有什么想说的？
      </p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="分享你的观点，哲学家们会回应你..."
          className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="shrink-0 rounded-xl px-4"
        >
          <Send className="mr-1.5 h-4 w-4" />
          发送
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="shrink-0 rounded-xl px-3 text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="mr-1.5 h-4 w-4" />
          跳过
        </Button>
      </div>
    </motion.div>
  );
}
