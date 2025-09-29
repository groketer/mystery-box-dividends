import bootstrap from '../../utils/bootstrap'

export default async function handler(req,res){
  const secret = req.headers['x-bootstrap-secret'] || ''
  if (process.env.BOOTSTRAP_SECRET && secret !== process.env.BOOTSTRAP_SECRET) return res.status(403).json({ error:'forbidden' })
  const result = await bootstrap()
  res.json(result)
}
