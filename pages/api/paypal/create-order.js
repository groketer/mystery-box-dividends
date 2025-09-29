const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  const resp = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method:'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(id+':'+secret).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  })
  const data = await resp.json()
  return data.access_token
}

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end()
  const { tier='bronze' } = req.body || {}
  const amountMap = { bronze: '10.00', silver: '25.00', gold: '50.00' }
  const amount = amountMap[tier] || '10.00'
  try {
    const token = await getAccessToken()
    const resp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method:'POST',
      headers: { 'Content-Type':'application/json', Authorization: 'Bearer '+token },
      body: JSON.stringify({ intent:'CAPTURE', purchase_units:[{ amount: { currency_code: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD', value: amount } }] })
    })
    const data = await resp.json()
    return res.json({ ok:true, order: data })
  } catch(e){ console.error(e); return res.status(500).json({ error: String(e) }) }
}
