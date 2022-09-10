import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import supabase, { InsertOne, FindOne, UpdateOne, DeleteOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'
import limiter from '../../scripts/server/ratelimit'

const app = nc();

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { username, reason } = req.body;
    if(user.admin) {
      await supabase.from("Bookmarks").delete().match({ username });
      await supabase.from("Images").delete().match({ username });
      await InsertOne("Banned", { username, reason });
      res.status(200).json({
        success: true
      })
    }else {
      res.status(401).json({
        success: false,
        message: "Unauthorized Attempt, only admins can ban users"
      })
    }
  });
});

export default app;