import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function bootstrap() {
  if (!url || !key) return { ok:false, reason:'missing_keys' }
  const admin = createClient(url, key)
  try {
    const createOrders = `CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      paypal_order_id text,
      tier text,
      amount numeric,
      buyer_name text,
      buyer_email text,
      status text,
      created_at timestamptz DEFAULT now(),
      prize_assigned boolean DEFAULT false,
      prize_data jsonb
    );`
    const createPrizes = `CREATE TABLE IF NOT EXISTS prizes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text,
      type text,
      delivery_url text,
      is_floor boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      meta jsonb
    );`
    const createAlloc = `CREATE TABLE IF NOT EXISTS allocations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid REFERENCES orders(id),
      prize_id uuid REFERENCES prizes(id),
      created_at timestamptz DEFAULT now()
    );`
    await admin.rpc('sql', { q: createOrders }).catch(()=>{})
    await admin.rpc('sql', { q: createPrizes }).catch(()=>{})
    await admin.rpc('sql', { q: createAlloc }).catch(()=>{})
    const { data } = await admin.from('prizes').select('id').limit(1)
    if (data && data.length>0) return { ok:true, seeded:false }
    const seed = [
      { name:'LinkedIn Optimization Checklist', type:'digital', delivery_url:'https://82ad-innocent.systeme.io/', is_floor:true },
      { name:'Digital Business Starter Kit', type:'digital', delivery_url:'https://www.pesamfukoni.com/', is_floor:true },
      { name:'Problem → Product Platform', type:'digital', delivery_url:'https://pbsolved.com/', is_floor:true },
      { name:'Future Me™ Access', type:'digital', delivery_url:'https://groketer.com/futureme/src/static/landing.html', is_floor:true },
      { name:'Tiny Wins Access', type:'digital', delivery_url:'https://interestcontent.com/tiny-wins/', is_floor:true },
      { name:'Resume Builder Pro (1-day trial)', type:'trial', delivery_url:'https://pbsolved.com/resume-analyzer/', is_floor:false },
      { name:'Essay Analyzer (24h free)', type:'trial', delivery_url:'https://pbsolved.com/essay-analyzer/', is_floor:false }
    ]
    for (const p of seed) {
      await admin.from('prizes').insert([{ name: p.name, type: p.type, delivery_url: p.delivery_url, is_floor: p.is_floor }])
    }
    return { ok:true, seeded:true }
  } catch(e) {
    console.error('bootstrap error', e)
    return { ok:false, error: String(e) }
  }
}
