'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VisitorCount({ t }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const counted = sessionStorage.getItem('visit-counted')
    const method = counted ? 'GET' : 'POST'

    fetch('/.netlify/functions/visitor-count', { method })
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        if (!counted) sessionStorage.setItem('visit-counted', '1')
      })
      .catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <motion.footer
      className="visitor-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="visitor-stat">
        <span className="visitor-label">{t.todayVisitors}</span>
        <span className="visitor-count">{stats.today.toLocaleString()}</span>
      </div>
      <div className="visitor-divider" />
      <div className="visitor-stat">
        <span className="visitor-label">{t.totalVisitors}</span>
        <span className="visitor-count">{stats.total.toLocaleString()}</span>
      </div>
    </motion.footer>
  )
}
