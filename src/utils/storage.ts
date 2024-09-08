export function saveToHistory(original: string, optimized: string) {
  const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
  history.push({ original, optimized, timestamp: Date.now() });
  localStorage.setItem('promptHistory', JSON.stringify(history));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem('promptHistory') || '[]');
}

export function clearHistory() {
  localStorage.removeItem('promptHistory');
}