"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Pause, Play, RotateCcw, Save, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessageSound } from "@/hooks/useMessageSound";
import { discussionStorage } from "@/lib/storage";
import { DiscussionPhase, Message, Philosopher } from "@/types/discussion";
import { DiscussionHistory } from "@/types/history";
import { ContinuePrompt } from "./ContinuePrompt";
import { DialogueBubble } from "./DialogueBubble";
import { PhaseIndicator } from "./PhaseIndicator";
import { UserInput } from "./UserInput";
import { ShareCard } from "./ShareCard";

interface DiscussionFlowProps {
  topic: string;
  philosophers: Philosopher[];
  onComplete?: (messages: Message[]) => void;
  onGoHome?: () => void;
}

export function DiscussionFlow({
  topic,
  philosophers,
  onComplete,
  onGoHome,
}: DiscussionFlowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<DiscussionPhase>("defining");
  const [currentPhilosopherIndex, setCurrentPhilosopherIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [waitingReason, setWaitingReason] = useState<
    "narrator" | "phaseTransition" | null
  >(null);
  const [pendingPhase, setPendingPhase] = useState<DiscussionPhase | null>(
    null,
  );
  const [showUserInput, setShowUserInput] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { playMessageSound } = useMessageSound();
  const MAX_ROUNDS = 6;
  const waitingForUser = waitingReason !== null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, waitingReason, isLoading, showUserInput, isCompleted]);

  const shouldInsertNarrator = useCallback(
    (allMessages: Message[]) => {
      const nonNarratorMessages = allMessages.filter(
        (message) => message.phase !== "narrator",
      );
      const narratorInterval = Math.max(philosophers.length * 2, 4);

      return (
        nonNarratorMessages.length > 0 &&
        nonNarratorMessages.length % narratorInterval === 0
      );
    },
    [philosophers.length],
  );

  const getNextPhase = useCallback(
    (nextRound: number): DiscussionPhase | null => {
      if (currentPhase === "defining" && nextRound >= 2) {
        return "debating";
      }

      if (currentPhase === "debating" && nextRound >= MAX_ROUNDS - 2) {
        return "concluding";
      }

      return null;
    },
    [currentPhase],
  );

  const insertNarrator = useCallback(
    async (currentMessages: Message[]) => {
      try {
        const response = await fetch("/api/narrator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: currentMessages,
            topic,
          }),
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { content: string };
        const narratorMessage: Message = {
          id: Date.now().toString(),
          philosopherId: "narrator",
          philosopherName: "AI 旁白",
          content: data.content,
          timestamp: new Date(),
          phase: "narrator",
        };

        setMessages((prev) => [...prev, narratorMessage]);
        playMessageSound();
      } catch (error) {
        console.error("Error inserting narrator:", error);
      }
    },
    [playMessageSound, topic],
  );

  const finalizeDiscussion = useCallback(
    (finalMessages: Message[]) => {
      const finalSummary: Message = {
        id: Date.now().toString(),
        philosopherId: "narrator",
        philosopherName: "AI 旁白",
        content:
          "讨论已暂时收束。真正重要的不是立刻得出统一答案，而是你已经看见了问题的不同入口、冲突和可能的延伸。",
        timestamp: new Date(),
        phase: "narrator",
      };

      setMessages((prev) => [...prev, finalSummary]);
      setIsCompleted(true);
      setIsRunning(false);
      setWaitingReason(null);
      setPendingPhase(null);
      onComplete?.([...finalMessages, finalSummary]);
    },
    [onComplete],
  );

  const generateNextMessage = useCallback(async () => {
    if (isLoading || philosophers.length === 0) {
      return;
    }

    const philosopher = philosophers[currentPhilosopherIndex];
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          philosopher,
          topic,
          phase: currentPhase,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = (await response.json()) as { content: string };
      const newMessage: Message = {
        id: Date.now().toString(),
        philosopherId: philosopher.id,
        philosopherName: philosopher.name,
        content: data.content,
        timestamp: new Date(),
        phase: currentPhase,
      };

      setMessages((prev) => [...prev, newMessage]);
      playMessageSound();

      const nextIndex = (currentPhilosopherIndex + 1) % philosophers.length;
      setCurrentPhilosopherIndex(nextIndex);

      if (nextIndex !== 0) {
        return;
      }

      const newRound = round + 1;
      setRound(newRound);

      const nextMessages = [...messages, newMessage];

      if (newRound >= MAX_ROUNDS) {
        finalizeDiscussion(nextMessages);
        return;
      }

      const nextPhase = getNextPhase(newRound);

      if (shouldInsertNarrator(nextMessages)) {
        await insertNarrator(nextMessages);
        setPendingPhase(nextPhase);
        setWaitingReason("narrator");
        setIsRunning(false);
        return;
      }

      if (nextPhase) {
        setPendingPhase(nextPhase);
        setWaitingReason("phaseTransition");
        setIsRunning(false);
        return;
      }

      setShowUserInput(true);
      setIsRunning(false);
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPhase,
    currentPhilosopherIndex,
    finalizeDiscussion,
    getNextPhase,
    insertNarrator,
    isLoading,
    messages,
    philosophers,
    playMessageSound,
    round,
    shouldInsertNarrator,
    topic,
  ]);

  useEffect(() => {
    if (
      !isRunning ||
      isLoading ||
      waitingForUser ||
      showUserInput ||
      isCompleted ||
      philosophers.length === 0
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void generateNextMessage();
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [
    generateNextMessage,
    isCompleted,
    isLoading,
    isRunning,
    philosophers.length,
    waitingForUser,
    showUserInput,
  ]);

  useEffect(() => {
    if (!isSaved) {
      return;
    }

    const timer = window.setTimeout(() => setIsSaved(false), 3000);
    return () => window.clearTimeout(timer);
  }, [isSaved]);

  const saveDiscussion = () => {
    if (savedId) {
      setIsSaved(true);
      return;
    }
    const id = Date.now().toString();
    const history: DiscussionHistory = {
      id,
      topic,
      philosophers,
      messages,
      createdAt: new Date(),
    };

    if (discussionStorage.save(history)) {
      setSavedId(id);
      setIsSaved(true);
    }
  };

  const openShareCard = () => {
    if (!savedId) {
      const id = Date.now().toString();
      const history: DiscussionHistory = {
        id,
        topic,
        philosophers,
        messages,
        createdAt: new Date(),
      };
      if (discussionStorage.save(history)) {
        setSavedId(id);
        setIsSaved(true);
      }
    }
    setShowShareCard(true);
  };

  const handleImageGenerated = useCallback(
    (imageData: string) => {
      if (savedId) {
        discussionStorage.saveShareImage(savedId, imageData);
      }
    },
    [savedId],
  );

  const handleUserContinue = () => {
    if (pendingPhase) {
      setCurrentPhase(pendingPhase);
    }

    setPendingPhase(null);
    setWaitingReason(null);
    setShowUserInput(true);
  };

  const handleUserSubmit = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      philosopherId: "user",
      philosopherName: "你",
      content,
      timestamp: new Date(),
      phase: currentPhase,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowUserInput(false);
    setIsRunning(true);
  };

  const handleUserSkip = () => {
    setShowUserInput(false);
    setIsRunning(true);
  };

  const toggleDiscussion = () => {
    if (waitingForUser || showUserInput) {
      return;
    }

    setIsRunning((prev) => !prev);
  };

  const resetDiscussion = () => {
    setMessages([]);
    setIsRunning(false);
    setCurrentPhase("defining");
    setCurrentPhilosopherIndex(0);
    setRound(0);
    setWaitingReason(null);
    setPendingPhase(null);
    setIsCompleted(false);
    setIsSaved(false);
    setShowUserInput(false);
    setShowShareCard(false);
    setSavedId(null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="mb-6 rounded-[2rem] border border-white/40 p-5 glass-strong shadow-glass sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
              Active Discussion
            </p>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {topic}
            </h2>
            <PhaseIndicator
              phase={currentPhase}
              round={round}
              maxRounds={MAX_ROUNDS}
            />
          </div>

          <div className="flex shrink-0 flex-wrap gap-3 lg:justify-end">
            <Button
              variant="outline"
              onClick={resetDiscussion}
              disabled={messages.length === 0}
              className="rounded-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              重新开始
            </Button>
            {!isCompleted && (
              <Button
                onClick={toggleDiscussion}
                disabled={
                  isLoading ||
                  waitingForUser ||
                  messages.length >= MAX_ROUNDS * philosophers.length
                }
                className="rounded-full px-6"
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {messages.length === 0 ? "开始讨论" : "继续"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1" viewportRef={scrollRef}>
        <div className="space-y-4 pb-6 pr-1">
          {messages.length === 0 && !isLoading && (
            <div className="rounded-[2rem] border border-dashed border-border/70 py-16 text-center text-subtle">
              <p className="mb-2 text-xl font-semibold text-foreground">
                点击 &ldquo;开始讨论&rdquo; 让圆桌正式开始
              </p>
              <p className="mx-auto max-w-xl text-base leading-7">
                哲学家们会轮流发言、回应彼此，并在关键节点暂停，方便你跟上讨论推进。
              </p>
            </div>
          )}

          {messages.map((message) => (
            <DialogueBubble key={message.id} message={message} />
          ))}

          <AnimatePresence>
            {waitingForUser && (
              <ContinuePrompt
                reason={waitingReason!}
                phase={pendingPhase ?? undefined}
                round={round}
                onContinue={handleUserContinue}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showUserInput && !isCompleted && (
              <UserInput onSubmit={handleUserSubmit} onSkip={handleUserSkip} />
            )}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-center gap-3 py-4 text-muted-foreground">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="h-2 w-2 rounded-full bg-primary/40"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: index * 0.15,
                    }}
                  />
                ))}
              </div>
              <span className="text-base">
                {philosophers[currentPhilosopherIndex].name} 正在思考...
              </span>
            </div>
          )}

          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="flex flex-wrap justify-center gap-3 pt-4"
              >
                <Button onClick={openShareCard} className="rounded-full px-6">
                  <Share2 className="mr-2 h-4 w-4" />
                  生成分享图
                </Button>
                <Button
                  variant="outline"
                  onClick={saveDiscussion}
                  disabled={isSaved}
                  className="rounded-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaved ? "已保存" : "保存对话"}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {showShareCard && (
        <ShareCard
          topic={topic}
          philosophers={philosophers}
          messages={messages}
          onClose={() => setShowShareCard(false)}
          onImageGenerated={handleImageGenerated}
        />
      )}
    </div>
  );
}
