import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import CalendarClient from '@/components/CalendarClient'

const CATEGORY_COLORS = {
  Conference: '#3B82F6',  // 파랑
  Workshop:   '#8B5CF6',  // 보라
  Seminar:    '#06B6D4',  // 하늘
  Symposium:  '#10B981',  // 초록
  Other:      '#6B7280',  // 회색
}

function resolveColor(color, category) {
  if (color === '#EF4444' || color === '#F59E0B') return color
  return CATEGORY_COLORS[category] || '#3B82F6'
}

function toDateString(value) {
  if (!value) return ''
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  return String(value)
}

function addOneDay(dateStr) {
  if (!dateStr) return undefined
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + 1)
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function getEvents() {
  const eventsDir = path.join(process.cwd(), 'content/events')
  if (!fs.existsSync(eventsDir)) return []

  return fs
    .readdirSync(eventsDir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(eventsDir, filename)
      const { data } = matter(fs.readFileSync(filePath, 'utf8'))

      const startDate = toDateString(data.start_date)
      const endDate = toDateString(data.end_date)

      return {
        id: filename.replace('.md', ''),
        title: data.title || '제목 없음',
        start: startDate,
        end: endDate ? addOneDay(endDate) : addOneDay(startDate),
        backgroundColor: resolveColor(data.color, data.category),
        borderColor: resolveColor(data.color, data.category),
        extendedProps: {
          startDisplay: startDate,
          endDisplay: endDate,
          location: data.location || '',
          organizer: data.organizer || '',
          category: data.category || '',
          description: data.description || '',
          url: data.url || '',
        },
      }
    })
}

export default function Home() {
  const events = getEvents()

  return (
    <main>
      <CalendarClient events={events} />
    </main>
  )
}
