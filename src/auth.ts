import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

import { db } from './db';


dotenv.config();

export async function authRequest(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['auth-key'];
  const username = req.headers['username'];
  if (!token || !username) {
    console.log(`401: Missing item: ${(!token) ? 'token,' : ''} ${(!username) ? 'username,' : ''}`)
    res.status(401).send({message: "authentication failed"});
    return
  }

  try {
    const user = await db
      .selectFrom('users')
      .select('id')
      .where('username', '=', username!)
      .limit(1)
      .execute();

      if (user.length === 0) {
        console.log('401: user DNE')
        res.status(401).send({message: "authentication failed"});
        return
      }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  if (token !== process.env.API_KEY) {
        console.log('401: bad key')
    res.status(401).send({message: "authentication failed, bad key"});
    return
  }

  next();
}