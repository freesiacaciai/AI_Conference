'use client'

function formatDate(dateStr, lang) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (lang === 'ko') return `${year}년 ${month}월 ${day}일`
  if (lang === 'es') return `${day}/${month}/${year}`
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function EventModal({ event, t, onClose }) {
  const lang = t === undefined ? 'ko' : Object.keys({ ko: 1, en: 1, es: 1 }).find(
    (k) => t.dateLabel === { ko: '일정', en: 'Date', es: 'Fecha' }[k]
  ) || 'ko'

  const hasEndDate = event.endDisplay && event.endDisplay !== event.startDisplay
  const categoryLabel = t.categories[event.category] || event.category

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <div className="modal-header">
          {event.category && (
            <span className="category-badge">{categoryLabel}</span>
          )}
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-icon">📅</span>
            <div>
              <div className="detail-label">{t.dateLabel}</div>
              <div className="detail-value">
                {formatDate(event.startDisplay, lang)}
                {hasEndDate && <> ~ {formatDate(event.endDisplay, lang)}</>}
              </div>
            </div>
          </div>

          {event.location && (
            <div className="detail-row">
              <span className="detail-icon">📍</span>
              <div>
                <div className="detail-label">{t.locationLabel}</div>
                <div className="detail-value">{event.location}</div>
              </div>
            </div>
          )}

          {event.organizer && (
            <div className="detail-row">
              <span className="detail-icon">🏛</span>
              <div>
                <div className="detail-label">{t.organizerLabel}</div>
                <div className="detail-value">{event.organizer}</div>
              </div>
            </div>
          )}

          {event.description && (
            <div className="detail-row">
              <span className="detail-icon">📝</span>
              <div>
                <div className="detail-label">{t.infoLabel}</div>
                <div className="detail-value description">{event.description}</div>
              </div>
            </div>
          )}
        </div>

        {event.url && (
          <div className="modal-footer">
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn"
            >
              {t.linkButton}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
