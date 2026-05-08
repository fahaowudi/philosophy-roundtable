"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Philosopher } from "@/types/discussion";

interface PhilosopherCardProps {
  philosopher: Philosopher;
  isSelected: boolean;
  onSelect: (philosopher: Philosopher) => void;
  disabled?: boolean;
}

export function PhilosopherCard({
  philosopher,
  isSelected,
  onSelect,
  disabled = false,
}: PhilosopherCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={() => onSelect(philosopher)}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border text-left transition-all duration-300 glass shadow-glass",
        isSelected
          ? "border-primary bg-white/82 shadow-glass-md ring-4 ring-primary/15 -translate-y-1"
          : "border-border/80 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/72 hover:shadow-glass-md",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="relative aspect-[1/2] w-full overflow-hidden">
        <Image
          src={philosopher.image}
          alt={philosopher.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {isSelected && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
            <Check className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="space-y-2">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {philosopher.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {philosopher.era}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-subtle">
            {philosopher.bio}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {philosopher.coreIdeas.slice(0, 3).map((idea) => (
            <span
              key={idea}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-normal text-white"
            >
              {idea}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 text-xs font-medium text-primary/70">
          {isSelected ? "再次点击可取消选择" : "点击选择这位哲学家"}
        </div>
      </div>
    </button>
  );
}
