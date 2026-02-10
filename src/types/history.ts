import { Philosopher, Message } from './discussion';

export interface DiscussionHistory {
  id: string;
  topic: string;
  philosophers: Philosopher[];
  messages: Message[];
  createdAt: Date;
  summary?: string;
}
