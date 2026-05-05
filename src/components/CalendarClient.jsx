'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import esLocale from '@fullcalendar/core/locales/es'
import { translations } from '@/lib/i18n'
import EventModal from './EventModal'
import EventList from './EventList'
import VisitorCount from './VisitorCount'

const LANGS = [
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
]

function downloadCSV(events) {
  const BOM = '﻿'
  const headers = ['학회명', '시작일', '종료일', '장소', '주최기관', '분류', '기타정보', '링크']
  const rows = events.map((e) => {
    const ep = e.extendedProps
    return [
      e.title, ep.startDisplay, ep.endDisplay,
      ep.location, ep.organizer, ep.category,
      ep.description, ep.url,
    ].map((v) => `"${(v || '').replace(/"/g, '""')}"`).join(',')
  })
  const csv = BOM + [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-conferences-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function CalendarClient({ events }) {
  const [lang, setLang] = useState('ko')
  const [view, setView] = useState('calendar')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved && translations[saved]) setLang(saved)

    const checkAdmin = () => {
      const user = window.netlifyIdentity?.currentUser()
      setIsAdmin(!!user)
    }
    checkAdmin()
    window.netlifyIdentity?.on('login', checkAdmin)
    window.netlifyIdentity?.on('logout', () => setIsAdmin(false))
  }, [])

  function changeLang(code) {
    setLang(code)
    localStorage.setItem('lang', code)
  }

  const t = translations[lang]

  function handleEventClick(info) {
    const ep = info.event?.extendedProps ?? info
    setSelectedEvent({
      title: info.event?.title ?? info.title,
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
      {/* 헤더 */}
      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="header-content">
          <motion.div
            className="header-icon"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            🔬
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {t.siteTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {t.siteSubtitle}
          </motion.p>
          <motion.div
            className="lang-switcher"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {LANGS.map((l) => (
              <motion.button
                key={l.code}
                className={`lang-btn${lang === l.code ? ' active' : ''}`}
                onClick={() => changeLang(l.code)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {l.flag} {l.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* 컨텐츠 */}
      <motion.div
        className="calendar-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        <div className="toolbar">
          <div className="view-toggle">
            {[
              { key: 'calendar', label: `📅 ${t.calendarView}` },
              { key: 'list',     label: `📋 ${t.listView}` },
            ].map((v) => (
              <motion.button
                key={v.key}
                className={`view-btn${view === v.key ? ' active' : ''}`}
                onClick={() => setView(v.key)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                {v.label}
              </motion.button>
            ))}
          </div>

          {isAdmin && (
            <motion.button
              className="csv-btn"
              onClick={() => downloadCSV(events)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              ⬇ {t.csvDownload}
            </motion.button>
          )}
        </div>

        {/* 뷰 전환 */}
        <AnimatePresence mode="wait">
          {view === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
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
                eventMouseEnter={(info) => { info.el.style.cursor = 'pointer' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <EventList
                events={events}
                t={t}
                lang={lang}
                onEventClick={(event) => setSelectedEvent(event)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 모달 */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            t={t}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>

      <VisitorCount t={t} />
    </>
  )
}
