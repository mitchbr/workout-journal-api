import dotenv from "dotenv";
import express from "express";

import { exerciseRouter } from "./exercises/routes";
import { userRouter } from "./users/routes";
import { workoutRouter } from "./workouts/routes";

dotenv.config();

const port = process.env.NODE_DOCKER_PORT

const app = express()
app.use(express.json())


app.use('/users', userRouter);
app.use('/workouts', workoutRouter);
app.use('/exercises', exerciseRouter);


app.listen(port, () => console.log(`Server has started on port: ${port}`))