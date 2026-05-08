"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PHILOSOPHERS, RECOMMENDED_LINEUP } from "@/lib/ai/philosophers";
import { Philosopher } from "@/types/discussion";
import { PhilosopherCard } from "./PhilosopherCard";

interface PhilosopherSelectorProps {
  onSelect: (philosophers: Philosopher[]) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

export function PhilosopherSelector({
  onSelect,
  isLoading = false,
  onBack,
}: PhilosopherSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(RECOMMENDED_LINEUP);

  const togglePhilosopher = (philosopher: Philosopher) => {
    setSelectedIds((prev) => {
      if (prev.includes(philosopher.id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== philosopher.id);
      }

      if (prev.length >= 5) return prev;
      return [...prev, philosopher.id];
    });
  };

  const handleContinue = () => {
    const selected = PHILOSOPHERS.filter((philosopher) =>
      selectedIds.includes(philosopher.id),
    );
    onSelect(selected);
  };

  const useRecommended = () => {
    setSelectedIds(RECOMMENDED_LINEUP);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {onBack && (
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-full px-4 text-card-foreground hover:bg-white/70 hover:text-primary"
          >
            ← 返回
          </Button>
        </div>
      )}

      <div className="mb-10 text-center sm:mb-14">
        <div className="mb-6 inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full glass shadow-glass sm:h-20 sm:w-20">
          <Users className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          选择哲学家
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          选择 1 到 5
          位哲学家加入这场圆桌讨论，让问题从不同传统和立场中被真正打开。
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/35 p-5 glass-strong shadow-glass sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-card-foreground">当前选择</p>
          <p className="mt-1 text-sm leading-6 text-subtle">
            已选择{" "}
            <span className="font-semibold text-primary">
              {selectedIds.length}
            </span>{" "}
            位哲学家，至少 1 位，至多 5 位。
          </p>
        </div>
        <Button
          variant="outline"
          onClick={useRecommended}
          className="h-auto whitespace-normal rounded-full border-border px-6 py-3 text-sm font-normal transition-all hover:border-primary hover:bg-primary hover:text-white sm:text-base"
        >
          使用推荐阵容（苏格拉底、康德、孔子）
        </Button>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PHILOSOPHERS.map((philosopher) => (
          <PhilosopherCard
            key={philosopher.id}
            philosopher={philosopher}
            isSelected={selectedIds.includes(philosopher.id)}
            onSelect={togglePhilosopher}
            disabled={
              isLoading ||
              (!selectedIds.includes(philosopher.id) && selectedIds.length >= 5)
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/35 p-5 glass shadow-glass sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          你将邀请{" "}
          <span className="text-xl font-bold text-primary">
            {selectedIds.length}
          </span>{" "}
          位哲学家围绕同一问题展开讨论。
        </p>
        <Button
          onClick={handleContinue}
          disabled={selectedIds.length === 0 || isLoading}
          size="lg"
          className="rounded-full px-8 text-base"
        >
          开始讨论
        </Button>
      </div>
    </div>
  );
}
