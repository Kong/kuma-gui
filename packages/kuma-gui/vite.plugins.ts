import crypto from 'crypto'
import { readFile, stat } from 'fs/promises'
import { dirname } from 'path'

import type { KumaHtmlVars } from '@/app/application/services/env/Env'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

const cwd = process.cwd()
const read = async (path: string) => (await readFile(`${cwd}/${path}`)).toString()
const version = JSON.parse((await read('./package.json'))).version
export const htmlVars = {
  baseGuiPath: '/gui',
  apiUrl: 'http://localhost:5681',
  version,
  product: 'Kuma', // we no longer use this, it can be removed in the backend
  mode: 'global',
  environment: 'universal',
  storeType: 'postgres',
  apiReadOnly: false,
}

const exists = async (path: string) => {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}
const interpolate = (template: string, vars: KumaHtmlVars) => {
  return template
    .replace('{{.BaseGuiPath}}', '/gui')
    .replace('{{.}}', JSON.stringify(vars))
}
export const kumaIndexHtmlVars = (): Plugin => {
  return {
    // replace the `{{.}}` with dev vars
    // reproducing what the kuma binary does
    name: 'kuma-index-html-vars',
    transformIndexHtml: (template) => interpolate(template, htmlVars),
  }
}
const server = (
  template: string = './index.html',
  vars: Partial<KumaHtmlVars> = {},
  csp: boolean = true,
) => async (server: PreviewServer | ViteDevServer) => {
  server.middlewares.use('/', async (req, res, next) => {
    const url = req.originalUrl || ''
    const baseGuiPath = vars.baseGuiPath || '/gui'
    const path = `${dirname(template).replace(baseGuiPath, '')}${url}`
    if ((url === '/' || url.startsWith(`${baseGuiPath}/`)) && !await exists(path)) {

      const cookies = (req.headers?.cookie ?? '').split(';')
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .reduce((prev, item) => {
          const [key, value] = item.split('=')
          prev[key] = value
          return prev
        }, {} as Record<string, string>)

      let body = interpolate(
        await read(template),
        {
          ...htmlVars,
          ...vars,
          ...Object.fromEntries(Object.entries({
            version: cookies.KUMA_VERSION,
            mode: cookies.KUMA_MODE,
            environment: cookies.KUMA_ENVIRONMENT,
            storeType: cookies.KUMA_STORE_TYPE,
          }).filter(([_, value]) => typeof value !== 'undefined')),
        } satisfies KumaHtmlVars,
      )

      if (csp) {
        const nonce = crypto.randomBytes(16).toString('base64')
        body = body.replace('<meta charset="utf-8" />', `<meta charset="utf-8" /><meta property="csp-nonce" nonce="${nonce}">`)
        res.setHeader('Content-Security-Policy', [
          "default-src 'self'",
          "script-src 'self'",
          "script-src-elem 'self'",
          "img-src 'self' data: ",
          // in a production environment the nonce is not required
          // its only used for vite dev-time live reloading client
          // the sha256 _is_ required
          `style-src 'self' 'sha256-UtFm94bwcb1Z4CU0svC29YMU26pP5RoZDN8zoniSJhU=' 'sha256-qo7STIM1L/OgU9y0De47mqod1UZFLJfTn36bRC42rfA=' 'nonce-${nonce}'`,
          // in production connect-src would use kuma's environment variable for
          // setting the location of the HTTP API (or just use the default)
          "connect-src 'self' localhost:5681 https://kuma.io",
        ].join(';'))
      }
      res.end(body)
    } else {
      next()
    }
  })

}
export const replicateKumaServer = (...args: Parameters<typeof server>): Plugin => {
  const plugin = {
    name: 'replicateKumaServer',
    config: (_: unknown, { mode }: { mode: string }) => {
      switch (mode) {
        case 'preview': {
          const { name, ...rest } = kumaIndexHtmlVars()
          Object.assign(plugin, rest)
          break
        }
      }
    },
    configureServer: server(...args),
    configurePreviewServer: server(...args),
  }
  return plugin
}
