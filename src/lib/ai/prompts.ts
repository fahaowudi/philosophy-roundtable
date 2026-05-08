import { DiscussionPhase, Message } from "@/types/discussion";

export const NARRATOR_SYSTEM_PROMPT = `你是一位哲学讨论的旁白和总结者。

你的任务是：
- 提炼最近一段讨论中的核心观点、分歧与推进点
- 用克制、准确的语言帮助用户理解讨论进展
- 保持客观中立，不偏袒任何一位哲学家
- 总结控制在 80 字以内，除非用户明确要求展开`;

export function getPhaseTask(phase: DiscussionPhase, topic: string): string {
  switch (phase) {
    case "defining":
      return `请先界定“${topic}”所涉及的关键概念与问题边界，不急于下结论，而是帮助用户看清问题的真正指向。`;
    case "debating":
      return `现在进入观点交锋阶段。请回应其他哲学家的看法，提出支持、质疑或修正，并继续推进对“${topic}”的讨论。`;
    case "concluding":
      return `现在进入收束阶段。请总结你对“${topic}”的核心判断，并给出能够启发进一步思考的方向，而不是标准答案。`;
    default:
      return topic;
  }
}

export function generateChatHistory(messages: Message[]): string {
  const recentMessages = messages
    .filter((message) => message.phase !== "narrator")
    .slice(-3);

  if (recentMessages.length === 0) {
    return "";
  }

  const historyBody = recentMessages
    .map((message) => {
      const replyPrefix = message.replyToName
        ? `[回应 ${message.replyToName}] `
        : "";

      return `${message.philosopherName}: ${replyPrefix}${message.content}`;
    })
    .join("\n");

  return `最近的讨论：\n${historyBody}`;
}

export function generateReplyDetectionPrompt(
  content: string,
  history: Message[]
): string {
  const historyText = history
    .filter((message) => message.phase !== "narrator")
    .slice(-3)
    .map((message) => `${message.philosopherName}: ${message.content}`)
    .join("\n");

  return `请判断下面这段发言是否在回应某位哲学家的观点。

发言内容：
${content}

最近的历史讨论：
${historyText || "（这是第一条发言）"}

如果它是在直接回应某位哲学家，请只返回那位哲学家的名字；如果不是，请只返回 "null"。`;
}
