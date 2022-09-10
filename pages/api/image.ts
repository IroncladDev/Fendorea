import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import supabase from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'

const app = nc();

app.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  let dataResult = await supabase
    .from("Images")
    .select("*, comments:Comments(*), currentUserLikes:Likes(id), currentUserBookmark:Bookmarks(id)")
    .eq("Likes.username", req.headers['x-replit-user-name'])
    .eq("id", +id)
    .eq("Comments.image_id", +id)
    .eq("Bookmarks.image_id", +id)
    .limit(1)
    .single()

  res.json(dataResult.data)
})

export default app;