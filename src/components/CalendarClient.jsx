'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import EventModal from './EventModal'

export default function CalendarClient({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null)

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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        locale={koLocale}
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
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  )
}
