import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import { InsertOne } from '../../scripts/server/db'
import auth from '../../scripts/server/auth-user'
import censor from '../../scripts/server/censor'
import b64 from '../../scripts/server/image-b64'
import limiter from '../../scripts/server/ratelimit'
import request from 'request'

const app = nc();

app.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  request(
    {
      url: url,
      encoding: null
    },
    (err, resp, buffer) => {
      if (!err && resp.statusCode === 200) {
        res.setHeader("Content-Type", "*/*");
        res.send(resp.body);
      }
    }
  );
})

export default app;