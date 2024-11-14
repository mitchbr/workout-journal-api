import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface WorkoutsTable {
  id: Generated<string>
  user_id: string
  title: string
  workout_date: ColumnType<Date, string | undefined, never>
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  deleted_at: ColumnType<Date, string | undefined, never>
}

export type Workout = Selectable<WorkoutsTable>
export type NewWorkout = Insertable<WorkoutsTable>
export type WorkoutUpdate = Updateable<WorkoutsTable>
