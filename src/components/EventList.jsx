'use client'

import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

function formatDate(dateStr, lang) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (lang === 'ko') return `${year}년 ${month}월 ${day}일`
  if (lang === 'es') return `${day}/${month}/${year}`
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function EventCard({ event, t, lang, onClick }) {
  const ep = event.extendedProps
  const hasEndDate = ep.endDisplay && ep.endDisplay !== ep.startDisplay
  const categoryLabel = t.categories[ep.category] || ep.category

  return (
    <motion.div
      className="event-card"
      style={{ borderLeftColor: event.backgroundColor || '#3B82F6' }}
      onClick={() => onClick(event)}
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="event-card-header">
        {ep.category && (
          <span
            className="event-card-badge"
            style={{
              background: `${event.backgroundColor}22`,
              color: event.backgroundColor,
              borderColor: `${event.backgroundColor}55`,
            }}
          >
            {categoryLabel}
          </span>
        )}
        <h3 className="event-card-title">{event.title}</h3>
      </div>

      <div className="event-card-meta">
        <span className="event-card-meta-item">
          📅 {formatDate(ep.startDisplay, lang)}
          {hasEndDate && <> ~ {formatDate(ep.endDisplay, lang)}</>}
        </span>
        {ep.location  && <span className="event-card-meta-item">📍 {ep.location}</span>}
        {ep.organizer && <span className="event-card-meta-item">🏛 {ep.organizer}</span>}
      </div>

      {ep.description && (
        <p className="event-card-desc">{ep.description}</p>
      )}

      {ep.url && (
        <a
          href={ep.url}
          target="_blank"
          rel="noopener noreferrer"
          className="event-card-link"
          onClick={(e) => e.stopPropagation()}
        >
          {t.linkButton}
        </a>
      )}
    </motion.div>
  )
}

function Section({ title, events, t, lang, onEventClick, muted = false }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <h2 className={`event-list-section-title${muted ? ' muted' : ''}`}>
        <span className={`section-dot ${muted ? 'past-dot' : 'upcoming-dot'}`} />
        {title}
        <span className="event-list-count">{events.length}</span>
      </h2>
      <motion.div
        className="event-cards"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {events.map((e) => (
          <EventCard key={e.id} event={e} t={t} lang={lang} onClick={onEventClick} />
        ))}
      </motion.div>
    </motion.section>
  )
}

export default function EventList({ events, t, lang, onEventClick }) {
  const today = new Date().toISOString().split('T')[0]

  const upcoming = events
    .filter((e) => (e.extendedProps.startDisplay || '') >= today)
    .sort((a, b) => (a.extendedProps.startDisplay || '').localeCompare(b.extendedProps.startDisplay || ''))

  const past = events
    .filter((e) => (e.extendedProps.startDisplay || '') < today)
    .sort((a, b) => (b.extendedProps.startDisplay || '').localeCompare(a.extendedProps.startDisplay || ''))

  function handleClick(event) {
    const ep = event.extendedProps
    onEventClick({
      title: event.title,
      startDisplay: ep.startDisplay,
      endDisplay: ep.endDisplay,
      location: ep.location,
      organizer: ep.organizer,
      category: ep.category,
      description: ep.description,
      url: ep.url,
    })
  }

  if (events.length === 0) {
    return <p className="no-events">{t.noEvents}</p>
  }

  return (
    <div className="event-list">
      {upcoming.length > 0 && (
        <Section title={t.upcoming} events={upcoming} t={t} lang={lang} onEventClick={handleClick} />
      )}
      {past.length > 0 && (
        <Section title={t.past} events={past} t={t} lang={lang} onEventClick={handleClick} muted />
      )}
    </div>
  )
}
