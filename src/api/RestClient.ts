import { getAppBaseUrl } from '@/utilities/getAppBaseUrl'
import { makeRequest } from './makeRequest'

export class RestClient {
  /**
   * The API origin. **Never has a trailing slash**.
   */
  _origin: string

  /**
   * The base API path relative to the API origin. **Never has a leading or trailing slash**.
   */
  _basePath: string

  /**
   * @param basePath **Default: `''`**. A base path under which the client’s API is served (e.g. `'api'`). Leading and trailing slashes will be ignored.
   */
  constructor(basePath: string = '') {
    let origin

    if (import.meta.env.PROD) {
      origin = getAppBaseUrl(window.location)
    } else {
      origin = import.meta.env.VITE_KUMA_API_SERVER_URL
    }

    this._origin = trimTrailingSlashes(origin)
    this._basePath = trimBoundarySlashes(basePath)
  }

  /**
   * The absolute API URL used in all requests. Includes its base path segment if one is set.
   */
  get url() {
    return [this._origin, this.basePath].filter((segment) => segment !== '').join('/')
  }

  get basePath() {
    return this._basePath
  }

  set basePath(basePath: string) {
    this._basePath = trimBoundarySlashes(basePath)
  }

  /**
   * Performs a network request using the GET method.
   *
   * @returns the response’s de-serialized data.
   */
  async get(path: string, options?: RequestInit & { params?: any }): Promise<any> {
    const processedOptions: RequestInit & { params?: any } = options ?? {}
    processedOptions.method = 'GET'

    const { data } = await this.raw(path, processedOptions)

    return data
  }

  /**
   * Performs a network request.
   *
   * @returns the response’s de-serialized data (when applicable) and the raw `Response` object.
   */
  async raw(path: string, options?: RequestInit & { params?: any }): Promise<{ response: Response, data: any }> {
    const url = path.startsWith('http') ? path : `${this.url}/${path}`

    return makeRequest(url, options)
  }
}

function trimTrailingSlashes(str: string): string {
  return str.replace(/\/+$/, '')
}

function trimBoundarySlashes(str: string): string {
  return str.replace(/^\/+/, '').replace(/\/+$/, '')
}
