"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  Home,
  Share2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShareCard } from "@/components/ShareCard";
import { discussionStorage } from "@/lib/storage";
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
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    setShareImage(discussionStorage.getShareImage(history.id));
  }, [history.id]);

  const handleDownloadImage = useCallback(() => {
    if (!shareImage) return;
    const link = document.createElement("a");
    link.download = `哲学圆桌会-${history.topic.slice(0, 10)}.png`;
    link.href = shareImage;
    link.click();
  }, [shareImage, history.topic]);

  const handleImageGenerated = useCallback(
    (imageData: string) => {
      discussionStorage.saveShareImage(history.id, imageData);
      setShareImage(imageData);
    },
    [history.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      {/* Header */}
      <div className="shrink-0 rounded-[2rem] border border-border/80 p-5 glass-strong shadow-glass sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {history.topic}
            </h1>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {history.philosophers.map((philosopher) => (
                <span
                  key={philosopher.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/90 px-2.5 py-1 text-xs font-medium text-white"
                >
                  <img
                    src={philosopher.image}
                    alt={philosopher.name}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  {philosopher.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5 text-xs text-subtle">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{history.philosophers.length} 位哲学家</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{history.createdAt.toLocaleString("zh-CN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share image preview or generate button */}
      {shareImage && !showFullImage && (
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowFullImage(true)}
            className="group relative mx-auto block w-full max-w-sm overflow-hidden rounded-2xl border border-white/30 shadow-glass transition-all hover:shadow-glass-md"
          >
            <img src={shareImage} alt="分享图" className="w-full" />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 to-transparent pb-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-medium text-white">
                点击查看大图
              </span>
            </div>
          </button>
          <div className="mt-2 flex justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadImage}
              className="rounded-full text-xs"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              保存分享图
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1" viewportClassName="pr-1">
        <div className="space-y-4 pb-4">
          {history.messages.map((message) => (
            <DialogueBubble
              key={message.id}
              message={message}
              isAnimating={false}
            />
          ))}

          {/* Bottom actions */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {shareImage ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadImage}
                className="rounded-full"
              >
                <Download className="mr-2 h-4 w-4" />
                保存分享图
              </Button>
            ) : (
              <Button
                onClick={() => setShowShareCard(true)}
                className="rounded-full px-6"
              >
                <Share2 className="mr-2 h-4 w-4" />
                生成分享图
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onBack}
              className="rounded-full text-card-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回记录
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

      {/* Full image modal */}
      {showFullImage && shareImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={shareImage}
            alt="分享图"
            className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ShareCard for generation */}
      {showShareCard && (
        <ShareCard
          topic={history.topic}
          philosophers={history.philosophers}
          messages={history.messages}
          onClose={() => setShowShareCard(false)}
          onImageGenerated={handleImageGenerated}
        />
      )}
    </div>
  );
}
