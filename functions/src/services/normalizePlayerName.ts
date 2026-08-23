// 특수 알파벳 제거: 'B. ŠEŠKO' -> 'B. SESKO'
export const normalizePlayerName = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
