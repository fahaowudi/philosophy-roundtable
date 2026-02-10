'use client';

import { DiscussionHistory } from '@/types/history';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, MessageSquare, RefreshCw } from 'lucide-react';

interface HistoryListProps {
  histories: DiscussionHistory[];
  onSelect: (history: DiscussionHistory) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function HistoryList({ histories, onSelect, onDelete, onRefresh }: HistoryListProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  if (histories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="rounded-3xl p-12 max-w-md mx-auto" style={{ backgroundColor: '#F5F5F5' }}>
          <MessageSquare className="h-16 w-16 mx-auto mb-4" style={{ color: '#2D5A3A' }} />
          <p className="text-xl mb-2" style={{ color: '#000000' }}>暂无对话记录</p>
          <p className="text-sm" style={{ color: '#999999' }}>完成一场讨论后，可以在这里查看历史记录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 标题区域 */}
      <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-normal mb-1" style={{ color: '#000000' }}>历史记录</h2>
            <p style={{ color: '#999999' }}>共 {histories.length} 条对话</p>
          </div>
          <button
            onClick={onRefresh}
            className="px-6 py-2 rounded-full border-2 text-base font-normal hover:bg-primary hover:text-white transition-all"
            style={{ borderColor: '#E0E0E0', color: '#333333' }}
          >
            <RefreshCw className="h-4 w-4 mr-2 inline" />
            刷新
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {histories.map((history) => (
          <div
            key={history.id}
            className="p-6 border-2 rounded-3xl cursor-pointer transition-all hover:shadow-md bg-white"
            style={{ borderColor: '#E0E0E0' }}
            onClick={() => onSelect(history)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-normal text-lg mb-3" style={{ color: '#000000' }}>{history.topic}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {history.philosophers.map((phil) => (
                    <span
                      key={phil.id}
                      className="text-xs px-3 py-1 rounded-full font-normal"
                      style={{ backgroundColor: '#A3B18A', color: '#FFFFFF' }}
                    >
                      {phil.avatar} {phil.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm" style={{ color: '#999999' }}>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(history.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {history.messages.filter(m => m.phase !== 'narrator').length} 条讨论
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(history.id);
                }}
                className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                style={{ color: '#999999' }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
