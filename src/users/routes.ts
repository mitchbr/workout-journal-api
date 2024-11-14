import { Request, Response, Router } from "express";
import { v4 as uuid4 } from 'uuid';

import { authRequest } from "../auth";
import { db } from '../db';

export const userRouter = Router();

userRouter.get('/', authRequest, async (req: Request, res: Response) => {
  try {
    const users = await db
      .selectFrom('users')
      .selectAll()
      .execute()
    res.status(200).send(users)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

userRouter.get('/:id', authRequest, async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .execute()
    res.status(200).send(user)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

userRouter.post('/', authRequest, async (req: Request, res: Response) => {
  const { username } = req.body
  try {
    const id = uuid4();
    const result = await db
      .insertInto('users')
      .values({
        id: id,
        username: username,
        updated_at: new Date().toISOString(),
      })
      .execute()
    res.status(200).send({ message: "Successfully added user", id: id })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

userRouter.patch('/:id', authRequest, async (req: Request, res: Response) => {
  // TODO: check fields are valid first
  const id = req.params.id
  try {
    const result = await db
      .updateTable('users')
      .set(req.body)
      .where('id', '=', id)
      .executeTakeFirst()
    res.status(200).send({ 
      message: "Successfully updated user", 
      id: id 
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

userRouter.delete('/:id', authRequest, async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const result = await db
      .updateTable('users')
      .set({
        // TODO: WTF?
        // deleted_at: new Date().toISOString()
      })
      .where('id', '=', id)
      .executeTakeFirst()
    console.log(result)
    res.status(200).send({ 
      message: "Successfully deleted user", 
      id: id 
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

userRouter.post('/login', async (req: Request, res: Response) => {
  const { username } = req.body
  try {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .execute()
    res.status(200).send(user)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})
