"use client";

import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";

import { DiscussionPhase } from "@/types/discussion";

interface ContinuePromptProps {
  reason: "narrator" | "phaseTransition";
  phase?: DiscussionPhase;
  round?: number;
  onContinue: () => void;
}

const phaseLabel: Record<DiscussionPhase, string> = {
  defining: "定义问题",
  debating: "观点交锋",
  concluding: "收束总结",
};

export function ContinuePrompt({
  reason,
  phase,
  round,
  onContinue,
}: ContinuePromptProps) {
  const isNarrator = reason === "narrator";
  const nextRoundLabel = round ? `第 ${round + 1} 轮` : "下一轮";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="my-4 flex justify-center sm:my-6"
    >
      <button
        type="button"
        onClick={onContinue}
        className="group flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-primary/20 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-md glass shadow-glass sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-0.5"
          >
            <MousePointerClick className="h-5 w-5 text-primary" />
          </motion.div>

          <div>
            {isNarrator ? (
              <>
                <p className="text-sm font-semibold text-primary">继续讨论</p>
                <p className="mt-1 text-xs leading-6 text-subtle sm:text-sm">
                  旁白总结已生成，点击后从{nextRoundLabel}继续新的观点推进。
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-primary">
                  进入{phase ? phaseLabel[phase] : "下一阶段"}
                </p>
                <p className="mt-1 text-xs leading-6 text-subtle sm:text-sm">
                  当前已完成第 {round} 轮，点击后切换到新的讨论阶段。
                </p>
              </>
            )}
          </div>
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
          点击继续
        </span>
      </button>
    </motion.div>
  );
}
