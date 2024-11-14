// Run the following command while in /scripts to migrate:
// npx tsx runmigrations.ts

import dotenv from "dotenv";
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from '../src/types';

import { promises as fs } from 'fs';
import {
  FileMigrationProvider,
  Migrator,
} from 'kysely';
import * as path from 'path';

const __dirname = path.resolve();
dotenv.config({path: path.join(__dirname, '../.env')});


async function migrateToLatest() {
  const pool = new Pool({
    host: process.env.POSTGRESDB_LOCAL_HOST,
    port: parseInt(process.env.DB_LOCAL_PORT || "5432"),
    user: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE
  })

  const dialect = new PostgresDialect({
      pool: pool
  })

  const db = new Kysely<Database>({
      dialect,
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()