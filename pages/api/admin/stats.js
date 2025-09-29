import { supabase } from '../../../utils/supabaseClient'
export default async function handler(req,res){
  try{
    const { data: orders } = await supabase.from('orders').select('*')
    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((s,o)=> s + (o.amount? parseFloat(o.amount):0),0) || 0
    const { data: allocs } = await supabase.from('allocations').select('*')
    const { data: bonusPrizes } = await supabase.from('prizes').select('id').eq('is_floor', false)
    const bonusIds = (bonusPrizes || []).map(x=>x.id)
    const bonusCount = (allocs || []).filter(a=> bonusIds.includes(a.prize_id)).length
    const bonusHitRate = totalOrders>0 ? Math.round((bonusCount/totalOrders)*100) : 0
    res.json({ totalOrders, totalRevenue, bonusHitRate })
  }catch(e){ res.status(500).json({ error: String(e) }) }
}
