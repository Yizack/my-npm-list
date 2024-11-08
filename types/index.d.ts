export {};

declare global {
  interface SiteStats {
    value: number;
    ref?: number;
    type?: string;
    description: string;
  }
}
