"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { DiscussionFlow } from "@/components/DiscussionFlow";
import { HistoryDetail } from "@/components/HistoryDetail";
import { HistoryList } from "@/components/HistoryList";
import { PhilosopherIntro } from "@/components/PhilosopherIntro";
import { PhilosopherSelector } from "@/components/PhilosopherSelector";
import { TopicInput } from "@/components/TopicInput";
import { Button } from "@/components/ui/button";
import { discussionStorage } from "@/lib/storage";
import { Philosopher } from "@/types/discussion";
import { DiscussionHistory } from "@/types/history";

type Step =
  | "home"
  | "topic"
  | "philosophers"
  | "discussion"
  | "philosopherIntro"
  | "history"
  | "historyDetail";

const IMMERSIVE_STEPS: Step[] = ["discussion", "historyDetail"];

function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("home");
  const [topic, setTopic] = useState("");
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<
    Philosopher[]
  >([]);
  const [histories, setHistories] = useState<DiscussionHistory[]>([]);
  const [selectedHistory, setSelectedHistory] =
    useState<DiscussionHistory | null>(null);

  function loadHistories() {
    setHistories(discussionStorage.getAll());
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadHistories();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const topicParam = searchParams.get("topic");
    if (topicParam) {
      setTopic(topicParam);
      setCurrentStep("philosophers");
    }
  }, [searchParams]);

  const handleTopicSubmit = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setCurrentStep("philosophers");
  };

  const handlePhilosophersSelect = (philosophers: Philosopher[]) => {
    setSelectedPhilosophers(philosophers);
    setCurrentStep("discussion");
  };

  const handleBack = () => {
    if (currentStep === "discussion") {
      setCurrentStep("philosophers");
    } else if (currentStep === "philosophers") {
      setCurrentStep("topic");
    } else if (currentStep === "topic") {
      setCurrentStep("home");
    } else if (currentStep === "philosopherIntro") {
      setCurrentStep("home");
    } else if (currentStep === "historyDetail") {
      setCurrentStep("history");
    } else if (currentStep === "history") {
      setCurrentStep("home");
    }
  };

  const handleSelectHistory = (history: DiscussionHistory) => {
    setSelectedHistory(history);
    setCurrentStep("historyDetail");
  };

  const handleDeleteHistory = (id: string) => {
    discussionStorage.delete(id);
    loadHistories();
  };

  const openHistory = () => {
    loadHistories();
    setCurrentStep("history");
  };

  const isImmersiveStep = IMMERSIVE_STEPS.includes(currentStep);
  const homeHighlights = [
    {
      emoji: "🏛️",
      title: "多位哲学家",
      description:
        "认识苏格拉底、康德、孔子、尼采和老子——五位来自不同时代与传统的思想家。",
      action: "了解更多",
      onClick: () => setCurrentStep("philosopherIntro"),
    },
    {
      emoji: "💭",
      title: "深度对话",
      description: "哲学家会轮流发言、回应和推进讨论，而不是简单给出平行答案。",
      action: "进入讨论流程",
      onClick: () => setCurrentStep("topic"),
    },
    {
      emoji: "📖",
      title: "启发思考",
      description:
        "回看以往讨论的展开过程，比直接看结论更能帮你找到自己的判断位置。",
      action: "查看历史记录",
      onClick: openHistory,
    },
  ];

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/30 glass-strong shadow-glass">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="cursor-pointer text-left text-base font-semibold text-card-foreground transition-colors hover:text-primary"
              onClick={() => setCurrentStep("home")}
            >
              哲学圆桌会
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="cursor-pointer rounded-full px-3 py-1 text-xs text-subtle transition-colors hover:bg-white/60 hover:text-primary"
            >
              回首页
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep("topic")}
              className={cn(
                "rounded-full px-4 text-card-foreground hover:bg-white/70 hover:text-primary",
                currentStep === "topic" && "bg-white/75 text-primary",
              )}
            >
              新建讨论
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openHistory}
              className={cn(
                "rounded-full px-4 text-card-foreground hover:bg-white/70 hover:text-primary",
                (currentStep === "history" ||
                  currentStep === "historyDetail") &&
                  "bg-white/75 text-primary",
              )}
            >
              历史记录
              {histories.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">
                  {histories.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main
        className={cn(
          "mx-auto w-full max-w-6xl px-4 sm:px-6",
          isImmersiveStep
            ? "flex min-h-[calc(100dvh-7rem)] flex-col py-6 sm:min-h-[calc(100dvh-8.5rem)] sm:py-8"
            : "py-10 sm:py-14 lg:py-16",
        )}
      >
        {currentStep === "home" && (
          <div className="mx-auto w-full max-w-6xl">
            <section className="relative overflow-hidden rounded-[2.25rem] border border-white/35 px-6 py-10 glass-strong shadow-glass-md sm:px-10 sm:py-12 lg:px-14 lg:py-16">
              <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-secondary/35 blur-3xl" />
                <div className="absolute -bottom-10 right-0 h-52 w-52 rounded-full bg-primary/12 blur-3xl" />
              </div>

              <div className="relative text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-primary/75">
                  PHILOSOPHY ROUNDTABLE
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  探索哲学的智慧
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  邀请历史上的伟大思想家围绕你的问题展开深度讨论，让观点冲突、澄清和启发真正发生。
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    onClick={() => setCurrentStep("topic")}
                    size="lg"
                    className="w-full rounded-full px-8 text-base sm:w-auto"
                  >
                    开始讨论
                  </Button>
                  <Button
                    variant="outline"
                    onClick={openHistory}
                    size="lg"
                    className="w-full rounded-full px-8 text-base sm:w-auto"
                  >
                    查看历史
                  </Button>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-6">
              {homeHighlights.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={item.onClick}
                  className="group cursor-pointer rounded-[1.75rem] border border-white/35 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/78 hover:shadow-glass-md glass shadow-glass sm:p-7"
                >
                  <div className="mb-5 text-4xl sm:text-5xl">{item.emoji}</div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                  <div className="mt-6 text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">
                    {item.action} →
                  </div>
                </button>
              ))}
            </section>
          </div>
        )}

        {currentStep === "philosopherIntro" && (
          <PhilosopherIntro
            onStart={() => setCurrentStep("topic")}
            onBack={handleBack}
          />
        )}

        {currentStep === "topic" && (
          <TopicInput onSubmit={handleTopicSubmit} onBack={handleBack} />
        )}

        {currentStep === "philosophers" && (
          <PhilosopherSelector
            onSelect={handlePhilosophersSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === "discussion" && (
          <div className="flex min-h-0 flex-1">
            <DiscussionFlow
              topic={topic}
              philosophers={selectedPhilosophers}
              onGoHome={() => setCurrentStep("home")}
            />
          </div>
        )}

        {currentStep === "history" && (
          <HistoryList
            histories={histories}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onRefresh={loadHistories}
            onBack={handleBack}
          />
        )}

        {currentStep === "historyDetail" && selectedHistory && (
          <div className="flex min-h-0 flex-1">
            <HistoryDetail
              history={selectedHistory}
              onBack={handleBack}
              onGoHome={() => setCurrentStep("home")}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export { Home };
