export {};

declare global {
  interface NPMPackage {
    description: string;
    homepage: string;
    keywords: string;
  }
}
