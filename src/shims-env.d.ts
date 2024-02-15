interface ImportMetaEnv {
  readonly VITE_VERSION_URL: string
  readonly VITE_NAMESPACE: string
  readonly VITE_KUMA_API_SERVER_URL: string
  readonly VITE_KUMA_DP_SERVER_URL: string
  readonly VITE_DOCS_BASE_URL: string
  readonly VITE_UTM: string
  // TODO: Remove this when unflagging KUMA_GATEWAYS_UI.
  readonly VITE_GATEWAYS_UI?: string
  readonly VITE_ZONE_CREATION_FLOW?: 'disabled' | 'enabled'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
