'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading?: boolean;
}

const HOT_TOPICS = [
  '机器能有真正的意识吗？',
  '什么是真正的自由？',
  '我们该如何面对死亡？',
  '正义是客观存在的吗？',
  '科技进步会让人更幸福吗？',
];

export function TopicInput({ onSubmit, isLoading = false }: TopicInputProps) {
  const [customTopic, setCustomTopic] = useState('');

  const handleSubmit = (topic: string) => {
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTopic.trim()) {
      handleSubmit(customTopic);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题区域 - 简约风格 */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4 tracking-tight" style={{ color: '#000000' }}>
          提出你的问题
        </h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: '#666666', lineHeight: '1.6' }}>
          邀请哲学家们围绕你的问题展开深度讨论
        </p>
      </div>

      {/* 热门话题 */}
      <div className="mb-12">
        <h2 className="text-2xl font-normal mb-8 text-center" style={{ color: '#333333' }}>
          热门话题
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {HOT_TOPICS.map((topic, index) => (
            <button
              key={index}
              onClick={() => handleSubmit(topic)}
              className="px-6 py-3 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all text-base font-normal"
              style={{
                borderColor: '#E0E0E0',
                color: '#333333',
                backgroundColor: '#FFFFFF'
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* 自定义问题输入 */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-normal mb-8 text-center" style={{ color: '#333333' }}>
          或提出你的问题
        </h2>
        <div className="flex gap-4">
          <Input
            placeholder="例如：什么是真正的幸福？"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 h-14 text-base rounded-full px-6 border-2 focus:border-primary"
            style={{ borderColor: '#E0E0E0' }}
          />
          <button
            onClick={() => handleSubmit(customTopic)}
            disabled={!customTopic.trim() || isLoading}
            className="h-14 px-8 rounded-full text-base font-normal hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2D5A3A', color: '#FFFFFF' }}
          >
            开始
          </button>
        </div>
      </div>
    </div>
  );
}
