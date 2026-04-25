'use client'

const CATEGORY_LABELS = {
  Conference: '컨퍼런스',
  Workshop:   '워크샵',
  Seminar:    '세미나',
  Symposium:  '심포지엄',
  Other:      '기타',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

export default function EventModal({ event, onClose }) {
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const hasEndDate = event.endDisplay && event.endDisplay !== event.startDisplay

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="modal-header">
          {event.category && (
            <span className="category-badge">
              {CATEGORY_LABELS[event.category] || event.category}
            </span>
          )}
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-icon">📅</span>
            <div>
              <div className="detail-label">일정</div>
              <div className="detail-value">
                {formatDate(event.startDisplay)}
                {hasEndDate && <> ~ {formatDate(event.endDisplay)}</>}
              </div>
            </div>
          </div>

          {event.location && (
            <div className="detail-row">
              <span className="detail-icon">📍</span>
              <div>
                <div className="detail-label">장소</div>
                <div className="detail-value">{event.location}</div>
              </div>
            </div>
          )}

          {event.organizer && (
            <div className="detail-row">
              <span className="detail-icon">🏛</span>
              <div>
                <div className="detail-label">주최기관</div>
                <div className="detail-value">{event.organizer}</div>
              </div>
            </div>
          )}

          {event.description && (
            <div className="detail-row">
              <span className="detail-icon">📝</span>
              <div>
                <div className="detail-label">기타 정보</div>
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
              공식 사이트 바로가기 →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
