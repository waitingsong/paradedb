import { initDbConnectionConfig } from '##/lib/config.js'
import type { DbConfig } from '##/lib/types.js'


export const dbConfig: DbConfig = {
  version: process.env['PARADEDB_VER'] ? process.env['PARADEDB_VER'] : 'latest',
  client: 'pg',
  connection: {
    ...initDbConnectionConfig,
  },
}
console.log('dbConfig', dbConfig)

