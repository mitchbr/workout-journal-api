// Run this command while in /scripts
// Migrations commands:
//  - To Latest: npx tsx runmigrations.ts
//  - Down: npx tsx runmigrations.ts down
//  - To specific: npx tsx runmigrations.ts to <migration_name>

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

function connectToDb() {
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
  return db
}


async function migrateToLatest() {
  const db = connectToDb()

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

async function migrateDown() {
  const db = connectToDb()

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })

  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed down`)
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

async function migrateTo(migration: string) {
  const db = connectToDb()

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })

  const { error, results } = await migrator.migrateTo(migration)

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed`)
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

const command = process.argv[2]
if (command === "down") {
  console.log("Migrating down")
  migrateDown()
} else if (command === "to") {
  const specifiedMigration = process.argv[3]
  if (!specifiedMigration) {
    console.log("Migration must be specified")
  } else {
    console.log(`Migrating to migration: ${specifiedMigration}`)
    migrateTo(specifiedMigration)  
  }
} else {
  console.log("Migrating to latest")
  migrateToLatest()
}
