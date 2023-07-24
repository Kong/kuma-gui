export interface InvalidParameter {
  field: string
  reason: string
  rule?: string
  choices?: string[]
}

type ApiErrorConstructorOptions = {
  response: Response
  type?: string | null
  title: string
  detail?: string | null
  instance?: string | null
  invalidParameters?: InvalidParameter[]
}

/**
 * Standard API error object following https://kong-aip.netlify.app/aip/193/.
 */
export class ApiError extends Error {
  response: Response
  type: string | null
  title: string
  detail: string | null
  instance: string | null
  invalidParameters: InvalidParameter[]

  constructor({
    response,
    type = null,
    title,
    detail = null,
    instance = null,
    invalidParameters = [],
  }: ApiErrorConstructorOptions) {
    super(title)

    this.name = 'ApiError'
    this.response = response
    this.type = type
    this.title = title
    this.detail = detail
    this.instance = instance
    this.invalidParameters = invalidParameters
  }

  toJSON() {
    return {
      status: this.response.status,
      type: this.type,
      title: this.title,
      detail: this.detail,
      instance: this.instance,
      invalidParameters: this.invalidParameters,
    }
  }
}
