'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import esLocale from '@fullcalendar/core/locales/es'
import { translations } from '@/lib/i18n'
import EventModal from './EventModal'

const LANGS = [
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
]

export default function CalendarClient({ events }) {
  const [lang, setLang] = useState('ko')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved && translations[saved]) setLang(saved)
  }, [])

  function changeLang(code) {
    setLang(code)
    localStorage.setItem('lang', code)
  }

  const t = translations[lang]

  function handleEventClick(info) {
    const ep = info.event.extendedProps
    setSelectedEvent({
      title: info.event.title,
      startDisplay: ep.startDisplay,
      endDisplay: ep.endDisplay,
      location: ep.location,
      organizer: ep.organizer,
      category: ep.category,
      description: ep.description,
      url: ep.url,
    })
  }

  return (
    <>
      <header className="site-header">
        <div className="header-content">
          <div className="header-icon">🤖</div>
          <h1>{t.siteTitle}</h1>
          <p>{t.siteSubtitle}</p>
          <div className="lang-switcher">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`lang-btn${lang === l.code ? ' active' : ''}`}
                onClick={() => changeLang(l.code)}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          locales={[koLocale, esLocale]}
          locale={lang}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
          }}
          height="auto"
          eventDisplay="block"
          eventMouseEnter={(info) => {
            info.el.style.cursor = 'pointer'
          }}
        />

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            t={t}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </>
  )
}
