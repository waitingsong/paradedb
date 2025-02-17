/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { DbConfig, DbConnectionConfig } from './types.js'


export const initDbConnectionConfig: DbConnectionConfig = {
  host: process.env['PARADEDB_HOST'] ? process.env['PARADEDB_HOST'] : 'localhost',
  port: process.env['PARADEDB_PORT'] ? +process.env['PARADEDB_PORT'] : 5432,
  database: process.env['PARADEDB_DB'] ? process.env['PARADEDB_DB'] : 'postgres',
  user: process.env['PARADEDB_USER'] ? process.env['PARADEDB_USER'] : 'postgres',
  password: process.env['PARADEDB_PASSWORD'] ? process.env['PARADEDB_PASSWORD'] : 'postgres',
  statement_timeout: 10_000, // in milliseconds
}

export const initDbConfigPart: Omit<DbConfig, 'connection'> = {
  version: process.env['PARADEDB_VER'] ? process.env['PARADEDB_VER'] : '',
  client: 'pg',
  pool: {
    min: 0,
    max: 100,
    // propagateCreateError: false,
  },
  acquireConnectionTimeout: 30000,
}

