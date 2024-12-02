import { Kysely, sql } from 'kysely'
import { v4 as uuidv4 } from 'uuid'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('exercises')
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().defaultTo(uuidv4()))
    .addColumn('workout_id', 'varchar(36)', (col) => 
      col.references('workouts.id').onDelete('cascade').notNull(),
    )
    .addColumn('title', 'varchar(36)', (col) => col.defaultTo('').notNull())
    .addColumn('type', 'varchar(36)', (col) => col.defaultTo('').notNull())
    .addColumn('info', 'json', (col) => col.defaultTo('{}').notNull())
    .addColumn('location', 'varchar(255)', (col) => col.defaultTo('').notNull())
    .addColumn('note', 'varchar(255)', (col) => col.defaultTo('').notNull())
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
  await db.schema.dropTable('exercises').execute()
}
