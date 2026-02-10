'use client';

import { useState } from 'react';
import { Philosopher } from '@/types/discussion';
import { PhilosopherCard } from './PhilosopherCard';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { PHILOSOPHERS, RECOMMENDED_LINEUP } from '@/lib/ai/philosophers';

interface PhilosopherSelectorProps {
  onSelect: (philosophers: Philosopher[]) => void;
  isLoading?: boolean;
}

export function PhilosopherSelector({ onSelect, isLoading = false }: PhilosopherSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(RECOMMENDED_LINEUP);

  const togglePhilosopher = (philosopher: Philosopher) => {
    setSelectedIds((prev) => {
      if (prev.includes(philosopher.id)) {
        // 至少保留1位
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== philosopher.id);
      } else {
        // 最多5位
        if (prev.length >= 5) return prev;
        return [...prev, philosopher.id];
      }
    });
  };

  const handleContinue = () => {
    const selected = PHILOSOPHERS.filter((p) => selectedIds.includes(p.id));
    onSelect(selected);
  };

  const useRecommended = () => {
    setSelectedIds(RECOMMENDED_LINEUP);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* 标题区域 - 简约风格 */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#A3B18A' }}>
          <Users className="h-10 w-10" style={{ color: '#FFFFFF' }} />
        </div>
        <h1 className="text-6xl font-bold mb-4 tracking-tight" style={{ color: '#000000' }}>
          选择哲学家
        </h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: '#666666', lineHeight: '1.6' }}>
          选择 1-5 位哲学家参与圆桌讨论
        </p>
      </div>

      {/* 推荐阵容 */}
      <div className="mb-12 text-center">
        <button
          onClick={useRecommended}
          className="px-8 py-4 rounded-full border-2 text-base font-normal hover:bg-primary hover:text-white hover:border-primary transition-all"
          style={{ borderColor: '#E0E0E0', color: '#333333' }}
        >
          使用推荐阵容（苏格拉底、康德、孔子）
        </button>
      </div>

      {/* 哲学家卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {PHILOSOPHERS.map((philosopher) => (
          <PhilosopherCard
            key={philosopher.id}
            philosopher={philosopher}
            isSelected={selectedIds.includes(philosopher.id)}
            onSelect={togglePhilosopher}
            disabled={
              isLoading ||
              (!selectedIds.includes(philosopher.id) && selectedIds.length >= 5)
            }
          />
        ))}
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-center gap-8 p-8 rounded-3xl" style={{ backgroundColor: '#F5F5F5' }}>
        <p className="text-base" style={{ color: '#666666' }}>
          已选择 <span className="font-bold text-xl" style={{ color: '#2D5A3A' }}>{selectedIds.length}</span> 位哲学家
        </p>
        <button
          onClick={handleContinue}
          disabled={selectedIds.length === 0 || isLoading}
          className="px-8 py-3 rounded-full text-base font-normal hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2D5A3A', color: '#FFFFFF' }}
          disabled={selectedIds.length === 0 || isLoading}
        >
          开始讨论
        </button>
      </div>
    </div>
  );
}
