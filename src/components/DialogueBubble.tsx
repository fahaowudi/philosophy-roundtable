'use client';

import { Message } from '@/types/discussion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface DialogueBubbleProps {
  message: Message;
  isAnimating?: boolean;
}

export function DialogueBubble({ message, isAnimating = true }: DialogueBubbleProps) {
  const isNarrator = message.phase === 'narrator';

  if (isNarrator) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center my-8"
      >
        <div
          className="max-w-3xl w-full border-2 rounded-3xl p-8"
          style={{ backgroundColor: '#A3B18A', borderColor: '#2D5A3A' }}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">📖</div>
            <div className="flex-1">
              <div className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#2D5A3A' }}>
                AI 旁白总结
              </div>
              <p className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>{message.content}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-4 mb-6"
    >
      <Avatar className={
        message.philosopherId === 'socrates' ? 'bg-blue-500' :
        message.philosopherId === 'kant' ? 'bg-purple-500' :
        message.philosopherId === 'confucius' ? 'bg-amber-500' :
        message.philosopherId === 'nietzsche' ? 'bg-red-500' :
        'bg-teal-500'
      }>
        <AvatarFallback className="text-white text-lg font-bold">
          {message.philosopherName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-normal text-lg" style={{ color: '#000000' }}>{message.philosopherName}</span>
          {message.replyToName && (
            <span className="text-sm" style={{ color: '#999999' }}>
              回复 {message.replyToName}
            </span>
          )}
        </div>
        <div
          className="p-6 border-2 rounded-3xl"
          style={{ backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' }}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: '#333333' }}>
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
