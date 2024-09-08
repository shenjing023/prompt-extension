export function logError(error: Error, context?: string) {
  console.error(`[PromptPro Error]${context ? ` (${context})` : ''}: `, error);
  // 这里可以添加错误报告逻辑，如发送到服务器
}

export function logInfo(message: string) {
  console.log(`[PromptPro Info]: ${message}`);
}