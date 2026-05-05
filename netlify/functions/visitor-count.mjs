import { getStore } from '@netlify/blobs'

export default async function (request) {
  try {
    const store = getStore('visitors')
    const today = new Date().toISOString().split('T')[0]

    let total = parseInt((await store.get('total')) || '0')
    let daily = parseInt((await store.get(`day-${today}`)) || '0')

    if (request.method === 'POST') {
      total += 1
      daily += 1
      await Promise.all([
        store.set('total', String(total)),
        store.set(`day-${today}`, String(daily)),
      ])
    }

    return new Response(JSON.stringify({ today: daily, total }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ today: 0, total: 0, error: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
