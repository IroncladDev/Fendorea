import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import { InsertOne, FindOne, UpdateOne, DeleteOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'

const app = nc();

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { image_id } = req.body;
    let data = await FindOne("Likes", { image_id, username: user.username })

    if(data) {
      let deleteCommentData = await DeleteOne("Likes", {
        "image_id": image_id,
        "username": user.username
      })
      
      if(deleteCommentData) {
        let currentImage = await FindOne("Images", { id: image_id });
        let updateImage = await UpdateOne("Images", { id: image_id }, { like_count: Number(currentImage.like_count) - 1 })
        res.status(200).json({
          success: true,
          remove: true
        })
      } else {
        res.status(500).json({
          message: "Failed to remove like",
          success: false
        })
      }
    } else {
      let applyLikeData = await InsertOne("Likes", {
        "image_id": image_id,
        "username": user.username
      });
      
      if(applyLikeData){
        let currentImage = await FindOne("Images", { id: image_id });
        let updateImage = await UpdateOne("Images", { id: image_id }, { like_count: Number(currentImage.like_count) + 1 })
        res.status(200).json({
          success: true,
          remove: false
        })
      }else{
        res.status(500).json({
          message: "Failed to add like",
          success: false
        })
      }
    }
    
  });
})

export default app;