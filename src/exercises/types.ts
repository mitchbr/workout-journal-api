import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface ExercisesTable {
  id: Generated<string>
  workout_id: string
  title: string
  type: string
  info: ColumnType<Object>
  location: string
  note: string
  Exercises_date: ColumnType<Date, string | undefined, never>
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  deleted_at: ColumnType<Date, string | undefined, never>
}

export type Exercises = Selectable<ExercisesTable>
export type NewExercises = Insertable<ExercisesTable>
export type ExercisesUpdate = Updateable<ExercisesTable>
