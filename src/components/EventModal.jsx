'use client'

import { motion } from 'framer-motion'

function formatDate(dateStr, lang) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (lang === 'ko') return `${year}년 ${month}월 ${day}일`
  if (lang === 'es') return `${day}/${month}/${year}`
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const langFromT = (t) => {
  if (t.dateLabel === '일정') return 'ko'
  if (t.dateLabel === 'Fecha') return 'es'
  return 'en'
}

export default function EventModal({ event, t, onClose }) {
  const lang = langFromT(t)
  const hasEndDate = event.endDisplay && event.endDisplay !== event.startDisplay
  const categoryLabel = t.categories[event.category] || event.category

  return (
    <motion.div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <motion.button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="닫기"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          ✕
        </motion.button>

        <div className="modal-header">
          {event.category && (
            <span className="category-badge">{categoryLabel}</span>
          )}
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          {[
            { icon: '📅', label: t.dateLabel, value: (
              <>
                {formatDate(event.startDisplay, lang)}
                {hasEndDate && <> ~ {formatDate(event.endDisplay, lang)}</>}
              </>
            )},
            event.location  && { icon: '📍', label: t.locationLabel,  value: event.location  },
            event.organizer && { icon: '🏛',  label: t.organizerLabel, value: event.organizer },
            event.description && { icon: '📝', label: t.infoLabel, value: (
              <span className="description">{event.description}</span>
            )},
          ]
            .filter(Boolean)
            .map((row, i) => (
              <motion.div
                key={i}
                className="detail-row"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              >
                <span className="detail-icon">{row.icon}</span>
                <div>
                  <div className="detail-label">{row.label}</div>
                  <div className="detail-value">{row.value}</div>
                </div>
              </motion.div>
            ))}
        </div>

        {event.url && (
          <motion.div
            className="modal-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <motion.a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {t.linkButton}
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
