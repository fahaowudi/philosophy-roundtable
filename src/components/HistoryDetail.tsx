"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Home, Share2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShareCard } from "@/components/ShareCard";
import { DiscussionHistory } from "@/types/history";
import { DialogueBubble } from "./DialogueBubble";

interface HistoryDetailProps {
  history: DiscussionHistory;
  onBack: () => void;
  onGoHome?: () => void;
}

export function HistoryDetail({
  history,
  onBack,
  onGoHome,
}: HistoryDetailProps) {
  const [showShareCard, setShowShareCard] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="rounded-[2rem] border border-border/80 p-5 glass-strong shadow-glass sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Button
              variant="outline"
              onClick={onBack}
              className="rounded-full border-border text-sm font-normal text-card-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              返回记录
            </Button>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {history.topic}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {history.philosophers.map((philosopher) => (
                <span
                  key={philosopher.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-normal text-white"
                >
                  <img
                    src={philosopher.image}
                    alt={philosopher.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {philosopher.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-subtle lg:justify-end">
            <Users className="h-4 w-4" />
            <span>{history.philosophers.length} 位哲学家参与</span>
            <span className="hidden lg:inline">·</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{history.createdAt.toLocaleString("zh-CN")}</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1" viewportClassName="pr-1">
        <div className="space-y-4 pb-4">
          {history.messages.map((message) => (
            <DialogueBubble
              key={message.id}
              message={message}
              isAnimating={false}
            />
          ))}

          {/* Action buttons at bottom */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              onClick={() => setShowShareCard(true)}
              className="rounded-full px-6"
            >
              <Share2 className="mr-2 h-4 w-4" />
              生成分享图
            </Button>
            {onGoHome && (
              <Button
                variant="outline"
                onClick={onGoHome}
                className="rounded-full"
              >
                <Home className="mr-2 h-4 w-4" />
                返回主页
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>

      {showShareCard && (
        <ShareCard
          topic={history.topic}
          philosophers={history.philosophers}
          messages={history.messages}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}
