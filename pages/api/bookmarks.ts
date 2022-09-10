import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import supabase from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'

const app = nc();

app.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  let dataResult = await supabase
    .from("Bookmarks")
    .select("*, image_id:Images(*)")
    .eq("username", req.headers['x-replit-user-name'])

  res.json(dataResult.data)
})

export default app;