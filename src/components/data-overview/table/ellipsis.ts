export function getElipsis(text: string, maxLength = 53) {
  if (typeof text !== "string" || text.length < maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
