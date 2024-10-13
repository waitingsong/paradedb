import type { Knex } from 'knex'
import _knex from 'knex'

import { initDbConfigPart, initDbConnectionConfig } from './config.js'
import { type RespCommon, parseRespCommon } from './helper.js'
import { IndexManager } from './index-manager/index-manager.js'
import type { Transaction } from './knex.types.js'
import type { DbConfig, DbConnectionConfig } from './types.js'


export class ParadeDb {
  public readonly index: IndexManager
  protected readonly dbh: Knex
  protected readonly dbConfig: DbConfig

  constructor(
    public readonly dbId: string,
    dbConfig: Partial<DbConfig>,
  ) {
    this.dbConfig = processDbConfig(dbConfig)

    this.dbh = createDbh(this.dbConfig)
    this.index = new IndexManager(this.dbh)
  }

  async getCurrentTime(): Promise<Date> {
    const res = await this.dbh.raw('SELECT CURRENT_TIMESTAMP AS currenttime;') as unknown
    const ret = parseRespCommon(res as RespCommon)
    return ret
  }

  /**
   *
   * @param zone available `SELECT pg_timezone_names()`
   */
  async setTimeZone(zone: string): Promise<string> {
    await this.dbh.raw(`SET TIME ZONE '${zone}'`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ret = await this.dbh.raw('SHOW TIME ZONE')
      .then((rows: { rows: unknown[] }) => {
        // @ts-expect-error TimeZone
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return rows.rows[0] ? rows.rows[0].TimeZone : 'N/A'
      })
    return ret as string
  }

  async startTransaction(): Promise<Transaction> {
    const ret = await this.dbh.transaction()
    return ret
  }

  async destroy(): Promise<void> {
    await this.dbh.destroy()
  }

}


function createDbh(knexConfig: DbConfig): Knex {
  // eslint-disable-next-line import/no-named-as-default-member
  const inst = _knex.knex(knexConfig)
  return inst
}

function processDbConfig(dbConfig: Partial<DbConfig>): DbConfig {
  const connection: DbConnectionConfig = {
    ...initDbConnectionConfig,
    ...dbConfig.connection,
  }

  const ret: DbConfig = {
    ...initDbConfigPart,
    ...dbConfig,
    connection,
  }
  return ret
}

