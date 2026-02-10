'use client';

import { useState, useRef, useEffect } from 'react';
import { Philosopher, Message, DiscussionPhase } from '@/types/discussion';
import { DiscussionHistory } from '@/types/history';
import { DialogueBubble } from './DialogueBubble';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pause, Play, RotateCcw, Loader2, Save, Home } from 'lucide-react';
import { useMessageSound } from '@/hooks/useMessageSound';
import { discussionStorage } from '@/lib/storage';

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
  const [currentPhase, setCurrentPhase] = useState<DiscussionPhase>('defining');
  const [currentPhilosopherIndex, setCurrentPhilosopherIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { playMessageSound } = useMessageSound();
  const MAX_ROUNDS = 6;

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 检查是否需要插入旁白总结
  const shouldInsertNarrator = (messages: Message[]) => {
    const nonNarratorMessages = messages.filter((m) => m.phase !== 'narrator');
    return nonNarratorMessages.length > 0 && nonNarratorMessages.length % 3 === 0;
  };

  // 生成下一条消息
  const generateNextMessage = async () => {
    if (isLoading) return;

    const philosopher = philosophers[currentPhilosopherIndex];
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          philosopher,
          topic,
          phase: currentPhase,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();

      const newMessage: Message = {
        id: Date.now().toString(),
        philosopherId: philosopher.id,
        philosopherName: philosopher.name,
        content: data.content,
        timestamp: new Date(),
        phase: currentPhase,
      };

      setMessages((prev) => [...prev, newMessage]);
      // 播放消息提示音
      playMessageSound();

      // 更新哲学家索引
      const nextIndex = (currentPhilosopherIndex + 1) % philosophers.length;
      setCurrentPhilosopherIndex(nextIndex);

      // 如果回到第一个哲学家，增加轮次
      if (nextIndex === 0) {
        const newRound = round + 1;
        setRound(newRound);

        // 检查是否需要插入旁白
        if (shouldInsertNarrator([...messages, newMessage])) {
          await insertNarrator([...messages, newMessage]);
        }

        // 检查是否进入下一阶段
        if (newRound >= 2 && currentPhase === 'defining') {
          setCurrentPhase('debating');
        } else if (newRound >= MAX_ROUNDS) {
          await finalizeDiscussion([...messages, newMessage]);
          setIsRunning(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 插入旁白总结
  const insertNarrator = async (currentMessages: Message[]) => {
    try {
      const response = await fetch('/api/narrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          topic,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();

      const narratorMessage: Message = {
        id: Date.now().toString(),
        philosopherId: 'narrator',
        philosopherName: 'AI 旁白',
        content: data.content,
        timestamp: new Date(),
        phase: 'narrator',
      };

      setMessages((prev) => [...prev, narratorMessage]);
      // 旁白消息也播放提示音
      playMessageSound();
    } catch (error) {
      console.error('Error inserting narrator:', error);
    }
  };

  // 保存对话
  const saveDiscussion = () => {
    const history: DiscussionHistory = {
      id: Date.now().toString(),
      topic,
      philosophers,
      messages,
      createdAt: new Date(),
    };

    const success = discussionStorage.save(history);
    if (success) {
      setIsSaved(true);
      // 3秒后重置保存状态
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // 完成讨论
  const finalizeDiscussion = async (finalMessages: Message[]) => {
    const finalSummary: Message = {
      id: Date.now().toString(),
      philosopherId: 'narrator',
      philosopherName: 'AI 旁白',
      content: `讨论已结束。这是一个开放性的哲学问题，每位哲学家都从不同的角度给出了见解。希望这场圆桌讨论能够激发你更深层次的思考。`,
      timestamp: new Date(),
      phase: 'narrator',
    };

    setMessages((prev) => [...prev, finalSummary]);
    setIsCompleted(true);
    onComplete?.([...finalMessages, finalSummary]);
  };

  // 开始/暂停讨论
  const toggleDiscussion = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  // 重新开始
  const resetDiscussion = () => {
    setMessages([]);
    setIsRunning(false);
    setCurrentPhase('defining');
    setCurrentPhilosopherIndex(0);
    setRound(0);
  };

  // 自动生成下一条消息
  useEffect(() => {
    if (isRunning && !isLoading && messages.length < MAX_ROUNDS * philosophers.length + 10) {
      const timer = setTimeout(() => {
        generateNextMessage();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentPhilosopherIndex, messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      {/* 控制栏 */}
      <div className="p-6 mb-6 border-2 rounded-3xl bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-normal text-2xl mb-2" style={{ color: '#000000' }}>{topic}</h2>
            <p className="text-base" style={{ color: '#666666' }}>
              {currentPhase === 'defining' && '定义问题阶段'}
              {currentPhase === 'debating' && '观点交锋阶段'}
              {currentPhase === 'concluding' && '总结阶段'}
              {' · '}第 {round + 1} 轮
            </p>
          </div>
          <div className="flex gap-3">
            {isCompleted && (
              <button
                onClick={saveDiscussion}
                disabled={isSaved}
                className="px-6 py-3 rounded-full border-2 text-base font-normal hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                style={{ borderColor: '#E0E0E0', color: '#333333' }}
              >
                <Save className="h-4 w-4 mr-2 inline" />
                {isSaved ? '已保存' : '保存对话'}
              </button>
            )}
            {isCompleted && onGoHome && (
              <button
                onClick={onGoHome}
                className="px-6 py-3 rounded-full border-2 text-base font-normal hover:bg-primary hover:text-white transition-all"
                style={{ borderColor: '#E0E0E0', color: '#333333' }}
              >
                <Home className="h-4 w-4 mr-2 inline" />
                返回主页
              </button>
            )}
            <button
              onClick={resetDiscussion}
              disabled={messages.length === 0}
              className="px-6 py-3 rounded-full border-2 text-base font-normal hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: '#E0E0E0', color: '#333333' }}
            >
              <RotateCcw className="h-4 w-4 mr-2 inline" />
              重新开始
            </button>
            {!isCompleted && (
              <button
                onClick={toggleDiscussion}
                disabled={isLoading || messages.length >= MAX_ROUNDS * philosophers.length}
                className="px-8 py-3 rounded-full text-base font-normal hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#2D5A3A', color: '#FFFFFF' }}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2 inline" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2 inline" />
                    {messages.length === 0 ? '开始讨论' : '继续'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 对话区域 */}
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="text-center py-16" style={{ color: '#999999' }}>
              <p className="text-xl mb-2">点击"开始讨论"开始圆桌会议</p>
              <p className="text-base">哲学家们将轮流发表见解</p>
            </div>
          )}

          {messages.map((message, index) => (
            <DialogueBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 py-4" style={{ color: '#999999' }}>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-base">
                {philosophers[currentPhilosopherIndex].name} 正在思考...
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
