export function createDemoOrderNumber(
  year: number,
  sequence: number,
): string {
  return `B-${year}-${String(sequence).padStart(4, "0")}`;
}