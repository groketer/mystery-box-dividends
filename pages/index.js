import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const paypalRef = useRef(null)
  const [purchased, setPurchased] = useState(false)
  const [prizes, setPrizes] = useState([])
  const [bonus, setBonus] = useState(null)
  const guaranteedPool = [
    { name: 'LinkedIn Optimization Checklist', url: 'https://82ad-innocent.systeme.io/' },
    { name: 'Digital Business Starter Kit', url: 'https://www.pesamfukoni.com/' },
    { name: 'Problem → Product Platform', url: 'https://pbsolved.com/' },
    { name: 'Future Me™ Access', url: 'https://groketer.com/futureme/src/static/landing.html' },
    { name: 'Tiny Wins Access', url: 'https://interestcontent.com/tiny-wins/' }
  ]
  const bonusPool = [
    { name: 'Resume Builder Pro (1-day trial)', url: 'https://pbsolved.com/resume-analyzer/' },
    { name: 'Essay Analyzer (24h free)', url: 'https://pbsolved.com/essay-analyzer/' }
  ]

  useEffect(()=>{
    if (typeof window === 'undefined') return
    if (!window.paypal || !paypalRef.current) return
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ tier: 'bronze' }) })
        const data = await res.json()
        return data?.order?.id || data?.id || data?.orderID || ''
      },
      onApprove: async (data, actions) => {
        await fetch('/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ orderID: data.orderID }) })
        const shuffled = guaranteedPool.sort(()=>0.5 - Math.random())
        const picked = shuffled.slice(0,2)
        setPrizes(picked)
        if (Math.random() < 0.3) {
          const b = bonusPool[Math.floor(Math.random()*bonusPool.length)]
          setBonus(b)
        }
        setPurchased(true)
      },
      onError: (err)=> { console.error('PayPal error', err); alert('Payment failed: '+err?.message || err) }
    }).render(paypalRef.current)
  }, [paypalRef.current])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white'>
      <div className='max-w-2xl w-full text-center'>
        <h1 className='text-4xl font-extrabold mb-4 text-indigo-700'>Mystery Box Dividends 🎁</h1>
        <p className='text-lg text-gray-700 mb-6'>Everyone wins — 2 guaranteed tools + 30% chance of a bonus prize. Buy a box and unlock instant digital resources.</p>

        {!purchased && <div className='mb-6' ref={paypalRef}></div>}

        {purchased && (
          <div className='bg-white shadow rounded-lg p-6 text-left'>
            <h2 className='text-2xl font-semibold text-green-600 mb-3'>Congratulations — you won:</h2>
            <ul className='list-disc list-inside mb-3'>
              {prizes.map((p,i)=> <li key={i}><a href={p.url} target='_blank' rel='noreferrer' className='text-indigo-600 underline'>{p.name}</a></li>)}
            </ul>
            {bonus && <div className='mt-3 p-3 border rounded bg-yellow-50'><strong>Bonus:</strong> <a href={bonus.url} target='_blank' rel='noreferrer' className='text-indigo-600 underline'>{bonus.name}</a></div>}
          </div>
        )}
      </div>
    </div>
  )
}
