// 哲学家角色
export interface Philosopher {
  id: string;
  name: string;
  era: string;
  avatar: string;
  image: string;
  color: string;
  systemPrompt: string;
  coreIdeas: string[];
  quotes: string[];
  bio: string;
}

// 对话消息
export interface Message {
  id: string;
  philosopherId: string;
  philosopherName: string;
  content: string;
  timestamp: Date;
  replyTo?: string; // 回复的消息ID
  replyToName?: string; // 回复的哲学家名字
  phase: "defining" | "debating" | "concluding" | "narrator";
}

// 对话会话
export interface Discussion {
  id: string;
  topic: string;
  philosophers: Philosopher[];
  messages: Message[];
  summary?: string;
  createdAt: Date;
}

// 对话阶段
export type DiscussionPhase = "defining" | "debating" | "concluding";
