import { useEffect, useState } from 'react'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(()=>{
    fetch('/api/admin/stats').then(r=>r.json()).then(d=>setStats(d)).catch(console.error)
    fetch('/api/admin/recent').then(r=>r.json()).then(d=>setRecent(d.orders||[])).catch(console.error)
  },[])

  return (
    <div className='min-h-screen p-8'>
      <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>

      <div className='grid grid-cols-3 gap-4 mb-6'>
        <div className='p-4 border rounded'><div className='text-sm text-gray-500'>Total Orders</div><div className='text-xl font-bold'>{stats?.totalOrders ?? '—'}</div></div>
        <div className='p-4 border rounded'><div className='text-sm text-gray-500'>Total Revenue</div><div className='text-xl font-bold'>{stats?.totalRevenue ?? '—'}</div></div>
        <div className='p-4 border rounded'><div className='text-sm text-gray-500'>Bonus Hit Rate</div><div className='text-xl font-bold'>{stats?.bonusHitRate ?? '—'}%</div></div>
      </div>

      <section>
        <h3 className='text-lg font-semibold mb-3'>Recent Orders</h3>
        <div className='space-y-3'>
          {recent.map(o=> (
            <div key={o.id} className='p-3 border rounded'>
              <div className='font-semibold'>{o.buyer_name} — {o.buyer_email}</div>
              <div className='text-sm'>Tier: {o.tier} — {new Date(o.created_at).toLocaleString()}</div>
              <div className='mt-2'>{(o.prize_data||[]).map(p=> <div key={p.id}><a href={p.delivery_url} target='_blank' rel='noreferrer'>{p.name}</a></div>)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
