'use client';

import { useState, useEffect } from 'react';
import { Philosopher } from '@/types/discussion';
import { DiscussionHistory } from '@/types/history';
import { TopicInput } from '@/components/TopicInput';
import { PhilosopherSelector } from '@/components/PhilosopherSelector';
import { DiscussionFlow } from '@/components/DiscussionFlow';
import { HistoryList } from '@/components/HistoryList';
import { HistoryDetail } from '@/components/HistoryDetail';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Sparkles } from 'lucide-react';
import { discussionStorage } from '@/lib/storage';

type Step = 'home' | 'topic' | 'philosophers' | 'discussion' | 'history' | 'historyDetail';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('home');
  const [topic, setTopic] = useState('');
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<Philosopher[]>([]);
  const [histories, setHistories] = useState<DiscussionHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<DiscussionHistory | null>(null);

  // 加载历史记录
  useEffect(() => {
    loadHistories();
  }, []);

  const loadHistories = () => {
    const allHistories = discussionStorage.getAll();
    setHistories(allHistories);
  };

  const handleTopicSubmit = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setCurrentStep('philosophers');
  };

  const handlePhilosophersSelect = (philosophers: Philosopher[]) => {
    setSelectedPhilosophers(philosophers);
    setCurrentStep('discussion');
  };

  const handleBack = () => {
    if (currentStep === 'discussion') {
      setCurrentStep('philosophers');
    } else if (currentStep === 'philosophers') {
      setCurrentStep('topic');
    } else if (currentStep === 'topic') {
      setCurrentStep('home');
    } else if (currentStep === 'historyDetail') {
      setCurrentStep('history');
    } else if (currentStep === 'history') {
      setCurrentStep('home');
    }
  };

  const handleSelectHistory = (history: DiscussionHistory) => {
    setSelectedHistory(history);
    setCurrentStep('historyDetail');
  };

  const handleDeleteHistory = (id: string) => {
    discussionStorage.delete(id);
    loadHistories();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 - 纯白背景 + 底部细边框 */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-6 h-16">
          <div className="flex items-center justify-between h-full">
            <h1
              className="text-base font-normal cursor-pointer hover:text-primary transition-colors"
              style={{ color: '#333333' }}
              onClick={() => setCurrentStep('home')}
            >
              哲学圆桌会
            </h1>
            <div className="flex gap-8 items-center">
              <button
                onClick={() => setCurrentStep('topic')}
                className="text-base font-normal hover:text-primary transition-colors"
                style={{ color: '#333333' }}
              >
                新建讨论
              </button>
              <button
                onClick={() => {
                  loadHistories();
                  setCurrentStep('history');
                }}
                className="text-base font-normal hover:text-primary transition-colors flex items-center gap-2"
                style={{ color: '#333333' }}
              >
                历史记录
                {histories.length > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {histories.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* 主页 */}
        {currentStep === 'home' && (
          <div className="max-w-5xl mx-auto">
            {/* Hero标题区域 - 简约大标题 */}
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold mb-8 tracking-tight" style={{ color: '#000000' }}>
                探索哲学的智慧
              </h1>
              <p className="text-xl max-w-2xl mx-auto mb-12" style={{ color: '#666666', lineHeight: '1.6' }}>
                邀请历史上的伟大思想家，围绕你的问题展开深度讨论
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep('topic')}
                  className="px-8 py-3 bg-primary text-white rounded-full text-base font-normal hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#2D5A3A' }}
                >
                  开始讨论
                </button>
                <button
                  onClick={() => {
                    loadHistories();
                    setCurrentStep('history');
                  }}
                  className="px-8 py-3 border rounded-full text-base font-normal hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#E0E0E0', color: '#333333' }}
                >
                  查看历史
                </button>
              </div>
            </div>

            {/* 功能卡片 - 浅绿背景 + 大圆角 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="p-8 rounded-3xl transition-all hover:shadow-md"
                style={{ backgroundColor: '#A3B18A' }}
              >
                <div className="text-5xl mb-6">🏛️</div>
                <h3 className="font-normal text-xl mb-3" style={{ color: '#FFFFFF' }}>
                  多位哲学家
                </h3>
                <p className="text-base" style={{ color: '#F0F0F0', lineHeight: '1.6' }}>
                  选择1-5位哲学家参与圆桌讨论，从不同角度探索问题
                </p>
              </div>

              <div
                className="p-8 rounded-3xl transition-all hover:shadow-md"
                style={{ backgroundColor: '#A3B18A' }}
              >
                <div className="text-5xl mb-6">💭</div>
                <h3 className="font-normal text-xl mb-3" style={{ color: '#FFFFFF' }}>
                  深度对话
                </h3>
                <p className="text-base" style={{ color: '#F0F0F0', lineHeight: '1.6' }}>
                  哲学家们轮流发表见解，相互回应，展开思想交锋
                </p>
              </div>

              <div
                className="p-8 rounded-3xl transition-all hover:shadow-md"
                style={{ backgroundColor: '#A3B18A' }}
              >
                <div className="text-5xl mb-6">📖</div>
                <h3 className="font-normal text-xl mb-3" style={{ color: '#FFFFFF' }}>
                  启发思考
                </h3>
                <p className="text-base" style={{ color: '#F0F0F0', lineHeight: '1.6' }}>
                  不是给出标准答案，而是激发你更深层次的思考
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 话题输入 */}
        {currentStep === 'topic' && <TopicInput onSubmit={handleTopicSubmit} />}

        {/* 哲学家选择 */}
        {currentStep === 'philosophers' && (
          <PhilosopherSelector onSelect={handlePhilosophersSelect} />
        )}

        {/* 讨论流程 */}
        {currentStep === 'discussion' && (
          <div className="h-[calc(100vh-180px)]">
            <DiscussionFlow
              topic={topic}
              philosophers={selectedPhilosophers}
              onGoHome={() => setCurrentStep('home')}
            />
          </div>
        )}

        {/* 历史记录列表 */}
        {currentStep === 'history' && (
          <HistoryList
            histories={histories}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onRefresh={loadHistories}
          />
        )}

        {/* 历史记录详情 */}
        {currentStep === 'historyDetail' && selectedHistory && (
          <div className="h-[calc(100vh-180px)]">
            <HistoryDetail history={selectedHistory} onBack={handleBack} />
          </div>
        )}
      </div>
    </div>
  );
}
