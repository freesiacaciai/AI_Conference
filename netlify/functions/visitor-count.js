const { getStore } = require('@netlify/blobs')

exports.handler = async function (event) {
  try {
    const store = getStore('visitors')
    const today = new Date().toISOString().split('T')[0]

    let total = parseInt((await store.get('total')) || '0')
    let daily = parseInt((await store.get(`day-${today}`)) || '0')

    if (event.httpMethod === 'POST') {
      total += 1
      daily += 1
      await Promise.all([
        store.set('total', String(total)),
        store.set(`day-${today}`, String(daily)),
      ])
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ today: daily, total }),
    }
  } catch {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ today: 0, total: 0 }),
    }
  }
}
