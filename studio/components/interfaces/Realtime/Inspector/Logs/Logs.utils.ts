import dayjs from 'dayjs'
import { LogData } from './Logs.types'

/**
 * Convert a micro timestamp from number/string to iso timestamp
 */
export const unixMicroToIsoTimestamp = (unix: string | number): string => {
  return dayjs.unix(Number(unix) / 1000).toISOString()
}

export const isUnixMicro = (unix: string | number): boolean => {
  const digitLength = String(unix).length === 16
  const isNum = !Number.isNaN(Number(unix))
  return isNum && digitLength
}

/**
 * Boolean check to verify that there are 3 columns:
 * - id
 * - timestamp
 * - event_message
 */
export const isDefaultLogPreviewFormat = (log: LogData) =>
  log && log.timestamp && log.event_message && log.id
