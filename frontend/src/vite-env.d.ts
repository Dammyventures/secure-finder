/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_URL: string
  readonly VITE_API_URL: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
