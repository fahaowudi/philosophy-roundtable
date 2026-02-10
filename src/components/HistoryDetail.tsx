'use client';

import { DiscussionHistory } from '@/types/history';
import { DialogueBubble } from './DialogueBubble';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryDetailProps {
  history: DiscussionHistory;
  onBack: () => void;
}

export function HistoryDetail({ history, onBack }: HistoryDetailProps) {
  return (
    <div className="h-full flex flex-col">
      {/* 头部信息 */}
      <div className="p-6 mb-6 border-2 rounded-3xl bg-white">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-2 text-base font-normal hover:text-primary transition-colors" style={{ color: '#333333' }}>
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#999999' }}>
            <Calendar className="h-4 w-4" />
            {history.createdAt.toLocaleString('zh-CN')}
          </div>
        </div>

        <h1 className="text-3xl font-normal mb-4" style={{ color: '#000000' }}>{history.topic}</h1>

        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: '#999999' }} />
          <div className="flex flex-wrap gap-2">
            {history.philosophers.map((phil) => (
              <span
                key={phil.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-normal"
                style={{ backgroundColor: '#A3B18A', color: '#FFFFFF' }}
              >
                {phil.avatar} {phil.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 对话内容 */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {history.messages.map((message) => (
            <DialogueBubble key={message.id} message={message} isAnimating={false} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
