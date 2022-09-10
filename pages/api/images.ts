import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import supabase from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'

const app = nc();

app.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { order, search, after, count } = req.query;
  let orderObject: [string, { ascending: boolean; }] = ['id', {ascending: false}];
  if(order === 'new'||!order) orderObject = ['id', {ascending: false}]
  else if(order === "old") orderObject = ['id', {ascending: true}]
  else if(order === 'likes') orderObject = ['like_count', {ascending: false}]
  else if(order === 'comments') orderObject = ['comment_count', {ascending: false}]

  let dataResult = supabase
    .from("Images")
    .select(`*, 
    currentUserLikes:Likes(id), currentUserBookmark:Bookmarks(id)`)
    .eq("Likes.username", req.headers['x-replit-user-name']||"")
    .eq("Bookmarks.username", req.headers['x-replit-user-name']||"")
  
  dataResult = dataResult
    .order(...orderObject)
  
  if(search) dataResult = dataResult.ilike('prompt', `%${search}%`);

  dataResult = dataResult.range(Number(after), Number(after) + (Number(count)||50)).limit(Number(count)||50);

  res.json((await (dataResult)).data)
})

export default app;