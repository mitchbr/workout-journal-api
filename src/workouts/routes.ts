import { Request, Response, Router } from "express";
import { v4 as uuid4 } from 'uuid';

import { authRequest } from "../auth";
import { db } from '../db';

export const workoutRouter = Router();

workoutRouter.get('/', authRequest, async (req: Request, res: Response) => {
  try {
    const workouts = await db
      .selectFrom('workouts')
      .selectAll()
      .execute()
    res.status(200).send(workouts)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

workoutRouter.get('/:id', authRequest, async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const workout = await db
      .selectFrom('workouts')
      .selectAll()
      .where('id', '=', id)
      .execute()
    res.status(200).send(workout)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

workoutRouter.post('/', authRequest, async (req: Request, res: Response) => {
  const { title, workout_date, user_id } = req.body
  try {
    const id = uuid4();
    const result = await db
      .insertInto('workouts')
      .values({
        id: id,
        user_id: user_id,
        title: title,
        workout_date: workout_date,
      })
      .execute()
    res.status(200).send({ message: "Successfully added workout", id: id })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

workoutRouter.patch('/:id', authRequest, async (req: Request, res: Response) => {
  // TODO: check fields are valid first
  const id = req.params.id
  try {
    const result = await db
      .updateTable('workouts')
      .set(req.body)
      .where('id', '=', id)
      .executeTakeFirst()
    res.status(200).send({ 
      message: "Successfully updated workout", 
      id: id 
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

workoutRouter.delete('/:id', authRequest, async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const result = await db
      .updateTable('workouts')
      .set({
        // TODO: WTF?
        // deleted_at: new Date().toISOString()
      })
      .where('id', '=', id)
      .executeTakeFirst()
    console.log(result)
    res.status(200).send({ 
      message: "Successfully deleted workout", 
      id: id 
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})
