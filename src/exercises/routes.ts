import { Request, Response, Router } from "express";
import { v4 as uuid4 } from 'uuid';

import { authRequest } from "../auth";
import { db } from '../db';

export const exerciseRouter = Router();

exerciseRouter.get('/', authRequest, async (req: Request, res: Response) => {
  let exerciseQuery = db
    .selectFrom('exercises')
    .selectAll()

  if (req.query.workout_id__in !== undefined) {
    const workoutIds = (req.query.workout_id__in as string).split(',')
    exerciseQuery = exerciseQuery
      .where('workout_id', 'in', workoutIds)
  }
  try {
    const exercises = await exerciseQuery.execute()
    res.status(200).send(exercises)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

exerciseRouter.get('/:id', authRequest, async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const exercise = await db
      .selectFrom('exercises')
      .selectAll()
      .where('id', '=', id)
      .execute()
    res.status(200).send(exercise)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

exerciseRouter.post('/', authRequest, async (req: Request, res: Response) => {
  const { workout_id, title, type, info, location, note } = req.body
  try {
    const id = uuid4();
    const result = await db
      .insertInto('exercises')
      .values({
        id: id,
        workout_id: workout_id,
        title: title,
        type: type,
        info: info,
        location: location,
        note: note,
      })
      .execute()
    res.status(200).send({ message: "Successfully added exercise", id: id })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

exerciseRouter.patch('/:id', authRequest, async (req: Request, res: Response) => {
  // TODO: check fields are valid first
  const id = req.params.id
  try {
    const result = await db
      .updateTable('exercises')
      .set(req.body)
      .where('id', '=', id)
      .executeTakeFirst()
    res.status(200).send({ 
      message: "Successfully updated exercise", 
      id: id 
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

exerciseRouter.delete('/:id', authRequest, async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const result = await db
      .updateTable('exercises')
      .set({
        // TODO: WTF?
        // deleted_at: new Date().toISOString()
      })
      .where('id', '=', id)
      .executeTakeFirst()
    console.log(result)
    res.status(200).send({ 
      message: "Successfully deleted exercise", 
      id: id 
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})
