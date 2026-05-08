"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { DiscussionPhase } from "@/types/discussion";

interface PhaseIndicatorProps {
  phase: DiscussionPhase;
  round: number;
  maxRounds: number;
}

const phases: { key: DiscussionPhase; label: string }[] = [
  { key: "defining", label: "定义问题" },
  { key: "debating", label: "观点交锋" },
  { key: "concluding", label: "收束总结" },
];

export function PhaseIndicator({
  phase,
  round,
  maxRounds,
}: PhaseIndicatorProps) {
  const currentIndex = phases.findIndex((item) => item.key === phase);
  const progress = round === 0 ? 0 : Math.min((round / maxRounds) * 100, 100);
  const roundLabel =
    round === 0 ? "尚未开始" : `第 ${Math.min(round, maxRounds)} / ${maxRounds} 轮`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {phases.map((item, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={item.key} className="flex items-center gap-2">
              {index > 0 && <div className="hidden h-px w-6 bg-border sm:block" />}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all duration-500 ${
                    isCompleted
                      ? "bg-secondary text-white"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 sm:text-sm ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-secondary"
                        : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span className="whitespace-nowrap text-xs text-subtle sm:text-sm">
          {roundLabel}
        </span>
      </div>
    </div>
  );
}
