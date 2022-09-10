import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import supabase, { InsertOne, FindOne, UpdateOne, DeleteOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'
import limiter from '../../scripts/server/ratelimit'

const app = nc();

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { image_id } = req.body;
    let image = await FindOne("Images", { id: +image_id });
    if(image){
      if(user.username === image.username || user.admin) {
        await supabase.from("Comments").delete().match({ image_id });
        await supabase.from("Likes").delete().match({ image_id });
        await supabase.from("Bookmarks").delete().match({ image_id });
        await DeleteOne("Images", { id: +image_id });
        res.status(200).json({
          success: true
        })
      }else {
        res.status(401).json({
          success: false,
          message: "Unauthorized Attempt, please make sure you are logged in and that you own this image."
        })
      }
    }else {
      res.status(404).json({
        success: false,
        message: "Image not found."
      })
    }
  });
});

export default app;