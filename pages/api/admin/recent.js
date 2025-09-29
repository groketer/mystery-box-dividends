import { supabase } from '../../../utils/supabaseClient'
export default async function handler(req,res){
  try{
    const { data } = await supabase.from('orders').select('*, prize_data').order('created_at',{ ascending:false }).limit(20)
    res.json({ orders: data || [] })
  }catch(e){ res.status(500).json({ error: String(e) }) }
}
