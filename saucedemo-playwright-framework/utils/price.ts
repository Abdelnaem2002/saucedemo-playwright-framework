/** Converts "$29.99" (or "Item total: $29.99") into the number 29.99. */
export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) {
    throw new Error(`Could not find a price in text: "${text}"`);
  }
  return Number(match[1]);
}

/** Converts 29.99 into "$29.99". */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
