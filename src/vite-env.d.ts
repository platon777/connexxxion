/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_AUTH: string
  readonly VITE_API_BASE_URL_CATEGORY: string
  readonly VITE_API_BASE_URL_COMMENT: string
  readonly VITE_API_BASE_URL_CONFESSION: string
  readonly VITE_API_BASE_URL_THEME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
