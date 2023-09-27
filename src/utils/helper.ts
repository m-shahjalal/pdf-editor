let id = 0;

export function ggID(): () => string {
  return () => String(id++);
}

export function timeout(ms: number): Promise<void> {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export const noop = (): void => {};
