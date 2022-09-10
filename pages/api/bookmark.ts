import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import { InsertOne, FindOne, UpdateOne, DeleteOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'

const app = nc();

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { image_id } = req.body;
    let data = await FindOne("Bookmarks", { image_id, username: user.username });

    if(data) {
      let deleteCommentData = await DeleteOne("Bookmarks", {
        "image_id": image_id,
        "username": user.username
      })
      
      if(deleteCommentData) {
        res.status(200).json({
          success: true,
          remove: true
        })
      } else {
        res.status(500).json({
          message: "Failed to remove bookmark",
          success: false
        })
      }
    } else {
      let applyBookmarkData = await InsertOne("Bookmarks", {
        "image_id": image_id,
        "username": user.username
      });
      
      if(applyBookmarkData){
        res.status(200).json({
          success: true,
          remove: false
        })
      }else{
        res.status(500).json({
          message: "Failed to add bookmark",
          success: false
        })
      }
    }
    
  });
})

export default app;