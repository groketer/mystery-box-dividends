import { supabase } from '../../utils/supabaseClient'
export default async function handler(req,res){
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error:'email required' })
  const { data, error } = await supabase.auth.signInWithOtp({ email })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok:true })
}
