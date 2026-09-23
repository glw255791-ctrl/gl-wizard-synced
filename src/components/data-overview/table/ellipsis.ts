export function getElipsis(text: string, maxLength = 53) {
  if (typeof text !== "string" || text.length <= maxLength) return text;

  // Path labels share a long common prefix; keep the distinctive end visible.
  if (text.includes("/")) {
    const parts = text.split("/");
    let kept = parts[parts.length - 1] ?? "";
    for (let index = parts.length - 2; index >= 0; index -= 1) {
      const candidate = `${parts[index]}/${kept}`;
      if (candidate.length > maxLength - 3) break;
      kept = candidate;
    }
    if (kept.length > maxLength) {
      return `...${kept.slice(-(maxLength - 3))}`;
    }
    return kept.length < text.length ? `.../${kept}` : kept;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}
