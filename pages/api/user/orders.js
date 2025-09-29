import { supabase } from '../../utils/supabaseClient'
export default async function handler(req,res){
  const email = req.query.email || req.body.email || ''
  if (!email) return res.json({ orders: [] })
  const { data } = await supabase.from('orders').select('*').eq('buyer_email', email).order('created_at',{ ascending:false })
  res.json({ orders: data || [] })
}
