import { Message } from "@/types/discussion";
import { DiscussionHistory } from "@/types/history";

const STORAGE_KEY = "philosophy-discussions";

type StoredMessage = Omit<Message, "timestamp"> & {
  timestamp: string;
};

type StoredDiscussionHistory = Omit<
  DiscussionHistory,
  "createdAt" | "messages"
> & {
  createdAt: string;
  messages: StoredMessage[];
};

function hasStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function hydrateMessage(message: StoredMessage): Message {
  return {
    ...message,
    timestamp: new Date(message.timestamp),
  };
}

function hydrateHistory(history: StoredDiscussionHistory): DiscussionHistory {
  return {
    ...history,
    createdAt: new Date(history.createdAt),
    messages: Array.isArray(history.messages)
      ? history.messages.map(hydrateMessage)
      : [],
  };
}

export const discussionStorage = {
  save(discussion: DiscussionHistory) {
    try {
      if (!hasStorage()) {
        return false;
      }

      const histories = discussionStorage.getAll();
      histories.unshift(discussion);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(histories.slice(0, 20)));
      return true;
    } catch (error) {
      console.error("保存对话失败:", error);
      return false;
    }
  },

  getAll(): DiscussionHistory[] {
    try {
      if (!hasStorage()) {
        return [];
      }

      const data = localStorage.getItem(STORAGE_KEY);

      if (!data) {
        return [];
      }

      const histories = JSON.parse(data) as StoredDiscussionHistory[];

      if (!Array.isArray(histories)) {
        return [];
      }

      return histories.map(hydrateHistory);
    } catch (error) {
      console.error("读取对话失败:", error);
      return [];
    }
  },

  getById(id: string): DiscussionHistory | null {
    try {
      return (
        discussionStorage.getAll().find((history) => history.id === id) ?? null
      );
    } catch (error) {
      console.error("读取对话失败:", error);
      return null;
    }
  },

  delete(id: string) {
    try {
      if (!hasStorage()) {
        return false;
      }

      const filteredHistories = discussionStorage
        .getAll()
        .filter((history) => history.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistories));
      return true;
    } catch (error) {
      console.error("删除对话失败:", error);
      return false;
    }
  },

  clear() {
    try {
      if (!hasStorage()) {
        return false;
      }

      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("清空对话失败:", error);
      return false;
    }
  },

  saveShareImage(id: string, imageData: string) {
    try {
      if (!hasStorage()) return false;
      localStorage.setItem(`share-image-${id}`, imageData);
      return true;
    } catch {
      return false;
    }
  },

  getShareImage(id: string): string | null {
    try {
      if (!hasStorage()) return null;
      return localStorage.getItem(`share-image-${id}`);
    } catch {
      return null;
    }
  },

  deleteShareImage(id: string) {
    try {
      if (!hasStorage()) return false;
      localStorage.removeItem(`share-image-${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
