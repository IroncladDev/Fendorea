import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import { InsertOne, FindOne, UpdateOne, DeleteOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'
import limiter from '../../scripts/server/ratelimit'

const app = nc();

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { comment_id } = req.body;
    let findComment = await FindOne("Comments", { id: comment_id });

    if(findComment){
      if(findComment.username === user.username || user.admin){
        await DeleteOne("Comments", { id: comment_id })
        let currentImage = await FindOne("Images", { id: findComment.image_id });
        let updateImage = await UpdateOne("Images", { id: findComment.image_id }, { comment_count: Number(currentImage.comment_count) - 1 })
        res.json({
          success: true
        })
      }else {
        res.status(401).json({
          success: false,
          message: "Unauthorized Attempt"
        })
      }
    }else {
      res.status(404).json({
        message: "Comment not found"
      })
    }
    
  });
});

export default app;