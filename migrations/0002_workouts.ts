import { Kysely, sql } from 'kysely'
import { v4 as uuidv4 } from 'uuid'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('workouts')
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().defaultTo(uuidv4()))
    .addColumn('user_id', 'varchar(36)', (col) => 
      col.references('users.id').onDelete('cascade').notNull(),
    )
    .addColumn('title', 'varchar(36)', (col) => col.defaultTo('').notNull())
    .addColumn('workout_date', 'date', (col) => col.defaultTo(sql`now()::timestamp::date`))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('deleted_at', 'timestamp')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workouts').execute()
}
