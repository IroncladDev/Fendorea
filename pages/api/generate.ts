import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import { InsertOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'
import b64 from '../../scripts/server/image-b64'
import { Post } from '../../scripts/fetch'
import limiter from '../../scripts/server/ratelimit'
import gic from 'get-image-colors'

const app = nc();

app.use(limiter(process.env.LIMIT_MS_GEN, process.env.LIMIT_COUNT_GEN));

app.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await auth(req, res, async (user) => {
    const { prompt } = req.body;
    const checkPrompt = censor(prompt);
    
    if(checkPrompt.contains){
      res.status(401).json({
        message: "A blacklisted word was detected in your input prompt.  Please keep things SFW, thank you.",
        success: false,
        data: null
      })
    }else{
      let b64_content = await b64(`https://dalle-mini.amasad.repl.co/gen/${encodeURIComponent(prompt)}`);
      if(b64_content.includes("data:text/html;")){
        res.status(500).json({
          success: false,
          message: "Amjad's DALLE api is down at the moment and images can't be uploaded.",
          data: null
        })
      }else{
        let colors = await gic(`https://dalle-mini.amasad.repl.co/gen/${encodeURIComponent(prompt)}`);
        let allColors = [...new Set(colors.map(c => c.hex()))];
        if(allColors.length <= 3 && allColors.every(c => c.startsWith("#0"))) {
          res.status(401).json({
            message: "Your image seemed to have been marked as NSFW by the generation api endpoint.  Please try again as sometimes false positives are generated.",
            success: false,
            data: null
          })
        }else{
          let upload = await Post("https://upload.connerow.dev/upload-base64", { image: b64_content });
          if(upload.success && upload.url){
            const insertedImageData = await InsertOne("Images", {
              "url": upload.url,
              "prompt": prompt,
              "username": user.username,
              "user_image": user.image
            });
            res.status(200).json({
              success: true,
              data: insertedImageData
            })
          }else {
            res.status(400).json({
              success: false,
              message: "Failed to upload image, please try again.",
              data: null
            })
          }
        }
      }
    }
  });
})

export default app;