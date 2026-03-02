export {};

declare global {
  interface Window {
    fbq?: (
      action: string,
      ...params: (string | number | Record<string, unknown>)[]
    ) => void;
    _fbq?: unknown;
  }
}
