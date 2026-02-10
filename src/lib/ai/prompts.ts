// AI 旁白 System Prompt
export const NARRATOR_SYSTEM_PROMPT = `你是一位哲学讨论的旁白和总结者。

任务：
- 每3-4轮对话后，总结哲学家们的核心观点
- 帮助用户理解讨论的进展和分歧
- 指出关键的思想碰撞点
- 语言简洁明了，80字以内

风格：
- 客观中立
- 不偏袒任何一方
- 突出思想的价值
- 启发用户思考`;

// 获取当前阶段的任务描述
export function getPhaseTask(phase: 'defining' | 'debating' | 'concluding', topic: string): string {
  switch (phase) {
    case 'defining':
      return `请对"${topic}"这个问题进行初步的定义和概念澄清。不要直接给出答案，而是先探讨问题的本质和涉及的核心概念。`;
    case 'debating':
      return `现在进入观点交锋阶段。请回应其他哲学家的观点，提出自己的看法，可以质疑、补充或发展已有的讨论。保持思辨的深度。`;
    case 'concluding':
      return `讨论接近尾声，请总结你对"${topic}"的核心见解，提供启发性的思考方向，而不是标准答案。`;
    default:
      return topic;
  }
}

// 生成对话历史上下文
export function generateChatHistory(messages: any[], currentPhilosopherId: string): string {
  const recentMessages = messages.slice(-3);
  if (recentMessages.length === 0) return '';

  let history = '最近的讨论：\n';
  recentMessages.forEach((msg, index) => {
    if (msg.phase !== 'narrator') {
      const prefix = msg.replyToName ? `[回复${msg.replyToName}] ` : '';
      history += `${msg.philosopherName}: ${prefix}${msg.content}\n`;
    }
  });

  return history;
}

// 检测回复目标
export function generateReplyDetectionPrompt(content: string, history: any[]): string {
  const historyText = history
    .slice(-3)
    .map((m) => `${m.philosopherName}: ${m.content}`)
    .join('\n');

  return `分析这段话在回应谁的观点：

${content}

历史对话：
${historyText || '（这是第一条发言）'}

如果是对某人的回应，返回人名；如果是新观点，返回"null"。只返回人名，不要其他内容。`;
}
