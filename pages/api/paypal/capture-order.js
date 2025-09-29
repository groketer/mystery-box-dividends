const PAYPAL_BASE = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end()
  const { orderID } = req.body || {}
  if (!orderID) return res.status(400).json({ error:'missing orderID' })
  try {
    const tokenResp = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, { method:'POST', headers:{ Authorization: 'Basic '+Buffer.from(process.env.PAYPAL_CLIENT_ID+':'+process.env.PAYPAL_CLIENT_SECRET).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' }, body:'grant_type=client_credentials' })
    const tok = await tokenResp.json()
    const token = tok.access_token
    const cap = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization: 'Bearer '+token } })
    const data = await cap.json()
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (url && key) {
        const supabaseAdmin = createClient(url, key)
        const purchase_unit = data.purchase_units && data.purchase_units[0]
        const amount = purchase_unit?.payments?.captures?.[0]?.amount?.value || null
        const payer = data.payer || {}
        await supabaseAdmin.from('orders').insert([{ paypal_order_id: orderID, buyer_email: payer.email_address || null, buyer_name: `${payer.name?.given_name || ''} ${payer.name?.surname || ''}`.trim(), amount, tier: req.body.tier || 'bronze', status: 'completed' }])
      }
    } catch(e){ console.error('supabase insert error', e) }
    return res.json({ ok:true, data })
  } catch(e){ console.error('capture error', e); return res.status(500).json({ error: String(e) }) }
}
