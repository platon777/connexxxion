/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_AUTH: string
  readonly VITE_API_BASE_URL_CATEGORY: string
  readonly VITE_API_BASE_URL_COMMENT: string
  readonly VITE_API_BASE_URL_CONFESSION: string
  readonly VITE_API_BASE_URL_THEME: string
  readonly VITE_IP_ENDPOINT?: string
  readonly VITE_REALTIME_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
