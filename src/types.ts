import { ExercisesTable } from './exercises/types'
import { UsersTable } from './users/types'
import { WorkoutsTable } from './workouts/types'

export interface Database {
  users: UsersTable
  workouts: WorkoutsTable
  exercises: ExercisesTable
}

