"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { PHILOSOPHERS } from "@/lib/ai/philosophers";

interface PhilosopherIntroProps {
  onStart: () => void;
  onBack?: () => void;
}

export function PhilosopherIntro({ onStart, onBack }: PhilosopherIntroProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 text-center sm:mb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-primary/75">
          PHILOSOPHERS
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          认识这些思想家
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          五位来自不同时代与传统的哲学家，将围绕你提出的问题展开深度讨论。
        </p>
      </div>

      <div className="mb-8 flex justify-start">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-full px-4 text-card-foreground hover:bg-white/70 hover:text-primary"
          >
            ← 返回
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {PHILOSOPHERS.map((philosopher) => (
          <article
            key={philosopher.id}
            className="overflow-hidden rounded-[2rem] border border-border/80 shadow-glass glass"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-[1/2] w-full md:aspect-auto md:h-auto md:w-48 md:min-h-[320px] md:shrink-0">
                <Image
                  src={philosopher.image}
                  alt={philosopher.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-gradient-to-r md:from-transparent md:to-white/30" />
              </div>

              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                <div className="mb-1">
                  <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                    {philosopher.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {philosopher.era}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {philosopher.coreIdeas.map((idea) => (
                    <span
                      key={idea}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-normal text-white"
                    >
                      {idea}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {philosopher.bio}
                </p>

                {philosopher.quotes.length > 0 && (
                  <blockquote className="mt-4 border-l-2 border-primary/30 pl-4 text-sm italic leading-7 text-subtle sm:text-base">
                    「{philosopher.quotes[0]}」
                  </blockquote>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button
          onClick={onStart}
          size="lg"
          className="w-full rounded-full px-8 text-base sm:w-auto"
        >
          开始讨论
        </Button>
      </div>
    </div>
  );
}
