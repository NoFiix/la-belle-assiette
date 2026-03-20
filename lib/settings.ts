import prisma from '@/lib/prisma'

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    for (const row of rows) {
      map[row.key] = row.value
    }
    return map
  } catch {
    return {}
  }
}

export function s(settings: Record<string, string>, key: string, fallback: string = ''): string {
  return settings[key] || fallback
}

const SCHEDULE_DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const

export function getSchedule(settings: Record<string, string>): { day: string; hours: string }[] {
  const monSat = settings['schedule_mon_sat'] || ''
  const friday = settings['schedule_friday'] || ''
  const sunday = settings['schedule_sunday'] || ''

  const fallbacks: Record<string, string> = {
    lundi: monSat,
    mardi: monSat,
    mercredi: monSat,
    jeudi: monSat,
    vendredi: friday,
    samedi: monSat,
    dimanche: sunday,
  }

  return SCHEDULE_DAYS.map((day) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    hours: settings[`schedule_${day}`] || fallbacks[day] || '',
  }))
}
