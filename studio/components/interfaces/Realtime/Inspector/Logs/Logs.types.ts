interface Metadata {
  [key: string]: string | number | Object | Object[] | any
}

export interface LogsEndpointParams {
  project: string // project ref
  iso_timestamp_start?: string
  iso_timestamp_end?: string
  sql?: string
}

export interface CustomLogData {
  [other: string]: unknown
}

export interface PreviewLogData extends CustomLogData {
  id: string
  timestamp: number
  event_message: string
  metadata?: Metadata
}
export type LogData = CustomLogData & PreviewLogData

type LFResponse<T> = {
  result: T[]
  error?: {
    code: number
    errors: {
      domain: string
      message: string
      reason: string | 'resourcesExceeded'
    }[]
    message: string
    status: string
  }
}
type ApiError = string

export type LogQueryError = Omit<LFResponse<unknown>, 'result'> | ApiError

export type QueryType =
  | 'api'
  | 'database'
  | 'functions'
  | 'fn_edge'
  | 'auth'
  | 'realtime'
  | 'storage'
  | 'supavisor'
  | 'pgbouncer'
  | 'postgrest'

export interface Filters {
  [key: string]: string | string[] | boolean | undefined | Filters
}
