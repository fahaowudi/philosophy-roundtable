"use client";

import { Clock, MessageSquare, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DiscussionHistory } from "@/types/history";

interface HistoryListProps {
  histories: DiscussionHistory[];
  onSelect: (history: DiscussionHistory) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onBack?: () => void;
}

export function HistoryList({
  histories,
  onSelect,
  onDelete,
  onRefresh,
  onBack,
}: HistoryListProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? "刚刚" : `${minutes} 分钟前`;
      }
      return `${hours} 小时前`;
    }

    if (days === 1) {
      return "昨天";
    }

    if (days < 7) {
      return `${days} 天前`;
    }

    return date.toLocaleDateString("zh-CN");
  };

  const getSummary = (history: DiscussionHistory): string | null => {
    const narratorMessages = history.messages.filter(
      (message) => message.phase === "narrator",
    );
    if (narratorMessages.length === 0) return null;
    const last = narratorMessages[narratorMessages.length - 1].content;
    return last.length > 100 ? last.slice(0, 100) + "…" : last;
  };

  const getPhilosopherHighlights = (
    history: DiscussionHistory,
  ): { name: string; content: string }[] => {
    return history.philosophers
      .map((p) => {
        const msgs = history.messages.filter(
          (m) => m.philosopherId === p.id && m.phase !== "narrator",
        );
        const last = msgs.length > 0 ? msgs[msgs.length - 1].content : "";
        return {
          name: p.name,
          content: last.length > 40 ? last.slice(0, 40) + "…" : last,
        };
      })
      .filter((h) => h.content);
  };

  const getMessageCount = (history: DiscussionHistory) =>
    history.messages.filter((message) => message.phase !== "narrator").length;

  const getPhilosopherCount = (history: DiscussionHistory) =>
    history.philosophers.length;

  if (histories.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md rounded-[2rem] border border-white/35 p-10 glass shadow-glass sm:p-12">
          <MessageSquare className="mx-auto mb-4 h-16 w-16 text-primary" />
          <p className="mb-2 text-xl text-foreground">暂无对话记录</p>
          <p className="text-sm text-subtle">
            完成一场讨论后，这里会保留你的历史记录，方便重新查看和回顾。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 text-center sm:mb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-primary/75">
          HISTORY
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          历史记录
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          共 {histories.length} 条对话，点击任意一条可以查看完整过程。
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-full px-4 text-card-foreground hover:bg-white/70 hover:text-primary"
          >
            ← 返回
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onRefresh}
          className="ml-auto rounded-full border-border px-5 py-2 text-sm font-normal transition-all hover:bg-primary hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>

      <div className="space-y-4">
        {histories.map((history) => {
          const summary = getSummary(history);
          const philosopherCount = getPhilosopherCount(history);
          const messageCount = getMessageCount(history);

          const highlights = getPhilosopherHighlights(history);

          return (
            <article
              key={history.id}
              className="group cursor-pointer rounded-[1.75rem] border border-border/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glass-md glass shadow-glass sm:p-6"
              onClick={() => onSelect(history)}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-7 text-foreground sm:text-xl">
                    {history.topic}
                  </h3>

                  {/* Philosopher highlights */}
                  {highlights.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {highlights.map((h) => (
                        <span
                          key={h.name}
                          className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-0.5 text-xs text-primary/80"
                        >
                          <span className="font-medium">{h.name}</span>
                          <span className="ml-1 text-muted-foreground">
                            {h.content}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  {summary && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-subtle">
                      {summary}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-subtle">
                    <span>{philosopherCount} 位哲学家</span>
                    <span>·</span>
                    <span>{messageCount} 条发言</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(history.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`删除"${history.topic}"的历史记录`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(history.id);
                  }}
                  className="self-end rounded-full p-2 text-subtle transition-colors hover:bg-red-50 hover:text-red-500 sm:self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
