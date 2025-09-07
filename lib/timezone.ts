// Utility functions for Indonesian timezone handling

export const INDONESIA_TIMEZONES = {
  WIB: 'Asia/Jakarta',    // Western Indonesia Time (UTC+7)
  WITA: 'Asia/Makassar',  // Central Indonesia Time (UTC+8) 
  WIT: 'Asia/Jayapura'    // Eastern Indonesia Time (UTC+9)
} as const

export type IndonesiaTimezone = keyof typeof INDONESIA_TIMEZONES

/**
 * Get current time in Indonesian timezone
 * Defaults to WIB (Jakarta time)
 */
export function getIndonesiaTime(timezone: IndonesiaTimezone = 'WIB'): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: INDONESIA_TIMEZONES[timezone] }))
}

/**
 * Format date to Indonesian timezone
 */
export function formatIndonesiaTime(
  date: string | Date, 
  timezone: IndonesiaTimezone = 'WIB',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: INDONESIA_TIMEZONES[timezone],
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  }
  
  return dateObj.toLocaleString('id-ID', defaultOptions)
}

/**
 * Format relative time in Indonesian
 */
export function formatRelativeTimeIndonesia(date: string | Date, timezone: IndonesiaTimezone = 'WIB'): string {
  const now = getIndonesiaTime(timezone)
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  // Convert target date to Indonesian timezone for accurate comparison
  const targetIndonesiaTime = new Date(targetDate.toLocaleString("en-US", { timeZone: INDONESIA_TIMEZONES[timezone] }))
  
  const diffInSeconds = Math.floor((now.getTime() - targetIndonesiaTime.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'baru saja'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`
  return `${Math.floor(diffInSeconds / 2592000)} bulan yang lalu`
}

/**
 * Get timezone abbreviation
 */
export function getTimezoneAbbreviation(timezone: IndonesiaTimezone): string {
  return timezone
}

/**
 * Format date for display in challenge history
 */
export function formatChallengeHistoryTime(date: string | Date, timezone: IndonesiaTimezone = 'WIB') {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const dateStr = dateObj.toLocaleDateString('id-ID', {
    timeZone: INDONESIA_TIMEZONES[timezone],
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  
  const timeStr = dateObj.toLocaleTimeString('id-ID', {
    timeZone: INDONESIA_TIMEZONES[timezone],
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  return {
    date: dateStr,
    time: timeStr,
    timezone: getTimezoneAbbreviation(timezone)
  }
}
