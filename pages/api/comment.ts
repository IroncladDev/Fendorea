import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import { InsertOne, FindOne, UpdateOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'
import limiter from '../../scripts/server/ratelimit'

const app = nc();

app.use(limiter(300000, 10));

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { image_id, body } = req.body;
    if(body.length < 3) {
      res.json({
        success: false,
        message: "Comment must be at least three characters"
      })
      return;
    }
    let testBody = censor(body);
    if(testBody.contains){
      res.status(403).json({
        message: "A blacklisted word was found in your comment, please keep things SFW and be kind to everyone.",
        success: false
      })
    } else {
      let applyCommentData = await InsertOne("Comments", {
        image_id,
        "username": user.username,
        "user_image": user.image,
        body
      });

      if(applyCommentData){
        let currentImage = await FindOne("Images", { id: image_id });
        let updateImage = await UpdateOne("Images", { id: image_id }, { comment_count: Number(currentImage.comment_count) + 1 })
        res.status(200).json({
          success: true,
          data: applyCommentData
        })
      }else{
        res.status(500).json({
          message: "Failed to add a comment",
          success: false
        })
      }
    }
    
    
  });
})

export default app;