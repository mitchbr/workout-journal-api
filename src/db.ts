import dotenv from "dotenv";
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types';

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRESDB_HOST,
  port: parseInt(process.env.DB_DOCKER_PORT || "5432"),
  user: process.env.POSTGRESDB_USER,
  password: process.env.POSTGRESDB_ROOT_PASSWORD,
  database: process.env.POSTGRESDB_DATABASE
})

const dialect = new PostgresDialect({
  pool: pool
})

export const db = new Kysely<Database>({
  dialect,
})
