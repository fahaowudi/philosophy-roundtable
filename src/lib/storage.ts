import { DiscussionHistory } from '@/types/history';

const STORAGE_KEY = 'philosophy-discussions';

export const discussionStorage = {
  // 保存对话记录
  save: (discussion: DiscussionHistory) => {
    try {
      const histories = discussionStorage.getAll();
      histories.unshift(discussion); // 最新的在前面

      // 只保留最近 20 条
      const trimmedHistories = histories.slice(0, 20);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistories));
      return true;
    } catch (error) {
      console.error('保存对话失败:', error);
      return false;
    }
  },

  // 获取所有对话记录
  getAll: (): DiscussionHistory[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const histories = JSON.parse(data);
      // 将日期字符串转换回Date对象
      return histories.map((h: any) => ({
        ...h,
        createdAt: new Date(h.createdAt),
      }));
    } catch (error) {
      console.error('读取对话失败:', error);
      return [];
    }
  },

  // 根据ID获取对话
  getById: (id: string): DiscussionHistory | null => {
    try {
      const histories = discussionStorage.getAll();
      return histories.find(h => h.id === id) || null;
    } catch (error) {
      console.error('读取对话失败:', error);
      return null;
    }
  },

  // 删除对话
  delete: (id: string) => {
    try {
      const histories = discussionStorage.getAll();
      const filtered = histories.filter(h => h.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('删除对话失败:', error);
      return false;
    }
  },

  // 清空所有记录
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('清空对话失败:', error);
      return false;
    }
  },
};
