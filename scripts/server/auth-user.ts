import { Request, Response } from 'express';
import supabase, { FindOne } from './db'

const auth = async (req: Request, res: Response, callback: (userData?: object) => unknown): unknown => {
  if(req.headers['x-replit-user-name']){
    let admin = await supabase.from("Admins").select("*").eq("username", req.headers['x-replit-user-name']);
    let isBanned = await FindOne("Banned", {
      username: req.headers['x-replit-user-name']
    })
    if(isBanned){
      res.status(401).json({
        message: "You have been banned for this reason: " + isBanned.reason,
        success: false
      })
    }else {
      return callback({
        username: req.headers["x-replit-user-name"],
        image: req.headers["x-replit-user-profile-image"],
        id: req.headers["x-replit-user-id"],
        bio: req.headers["x-replit-user-bio"],
        roles: req.headers["x-replit-user-roles"],
        teams: req.headers["x-replit-user-teams"],
        url: req.headers["x-replit-user-url"],
        admin: !!admin.data
      });
    }
  }else {
    return res.status(401).json({
      message: "Unauthorized Attempt, please log in.",
      success: false
    })
  }
};

export default auth;