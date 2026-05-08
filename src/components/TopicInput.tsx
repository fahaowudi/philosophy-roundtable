"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

const HOT_TOPICS = [
  "机器能有真正的意识吗？",
  "什么是真正的自由？",
  "我们该如何面对死亡？",
  "正义是客观存在的吗？",
  "科技进步会让人更幸福吗？",
];

export function TopicInput({
  onSubmit,
  isLoading = false,
  onBack,
}: TopicInputProps) {
  const [customTopic, setCustomTopic] = useState("");

  const handleSubmit = (topic: string) => {
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && customTopic.trim()) {
      handleSubmit(customTopic);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-primary/75">
          Start With A Question
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          提出你的问题
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          先把问题问得足够清楚，再邀请哲学家们围绕它展开真正有推进的讨论。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="rounded-[2rem] border border-white/35 p-6 glass shadow-glass sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-card-foreground">
              热门话题
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              如果你想先快速体验，可以直接从这些足够有张力的问题开始。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {HOT_TOPICS.map((topic) => (
              <Button
                key={topic}
                variant="outline"
                onClick={() => handleSubmit(topic)}
                className="min-h-11 whitespace-normal rounded-full border-border px-5 py-3 text-left text-sm font-normal transition-all hover:border-primary hover:bg-primary hover:text-white sm:text-base"
              >
                {topic}
              </Button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/40 p-6 glass-strong shadow-glass sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-card-foreground">
              自定义问题
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              问题越具体，讨论越容易真正推进。按 Enter 也可以直接开始。
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="例如：什么是真正的幸福？"
              value={customTopic}
              onChange={(event) => setCustomTopic(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="h-14 rounded-2xl border-2 border-border px-5 text-base focus:border-primary"
            />
            <Button
              onClick={() => handleSubmit(customTopic)}
              disabled={!customTopic.trim() || isLoading}
              size="lg"
              className="h-12 rounded-full px-6 text-base"
            >
              开始讨论
            </Button>
            <p className="text-xs leading-6 text-subtle">
              例子不必很宏大，真正值得讨论的问题往往来自你当下的困惑。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
