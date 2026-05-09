"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { PHILOSOPHERS } from "@/lib/ai/philosophers";
import { Message } from "@/types/discussion";

interface DialogueBubbleProps {
  message: Message;
  isAnimating?: boolean;
}

export function DialogueBubble({
  message,
  isAnimating = true,
}: DialogueBubbleProps) {
  const isNarrator = message.phase === "narrator";
  const narratorMotion = isAnimating
    ? {
        initial: { opacity: 0, scale: 0.96, y: 18 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {};
  const bubbleMotion = isAnimating
    ? {
        initial: { opacity: 0, x: -18 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.35 },
      }
    : {};

  const isUserMessage = message.isUser;

  if (isNarrator) {
    return (
      <motion.div
        {...narratorMotion}
        className="my-6 flex justify-center sm:my-8"
      >
        <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/40 bg-secondary/15 p-5 shadow-glass-md glass sm:p-7">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-3xl sm:text-4xl">✦</div>
            <div className="flex-1">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                AI 旁白总结
              </div>
              <p className="text-sm leading-7 text-foreground/90 sm:text-base">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...bubbleMotion}
      className="mb-5 flex items-start gap-3 sm:mb-6 sm:gap-4"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
        {isUserMessage ? (
          <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-base font-bold text-white sm:text-lg">
            你
          </div>
        ) : (
          <Image
            src={
              PHILOSOPHERS.find((p) => p.id === message.philosopherId)?.image ??
              "/philosophers/socrates.png"
            }
            alt={message.philosopherName}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-foreground sm:text-lg">
            {message.philosopherName}
          </span>
          {message.replyToName && (
            <span className="rounded-full bg-white/45 px-2.5 py-1 text-xs text-subtle">
              回应 {message.replyToName}
            </span>
          )}
        </div>
        <div className="rounded-[1.75rem] border border-white/35 p-4 shadow-glass glass sm:p-6">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-card-foreground sm:text-base">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
