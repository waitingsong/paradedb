import type { Knex } from 'knex'
import _knex from 'knex'

import { initDbConfigPart, initDbConnectionConfig } from './config.js'
import { type RespCommon, parseRespCommon } from './helper.js'
import { IndexManager } from './index-manager/index-manager.js'
import type { Transaction } from './knex.types.js'
import type { DbConfig, DbConnectionConfig } from './types.js'


export class ParadeDb {
  readonly index: IndexManager
  readonly dbh: Knex
  protected readonly dbConfig: DbConfig

  constructor(
    public readonly dbId: string,
    dbConfig: Partial<DbConfig>,
  ) {
    this.dbConfig = processDbConfig(dbConfig)

    this.dbh = createDbh(this.dbConfig)
    this.search = this.dbh
    this.index = new IndexManager(this.dbh, this.dbConfig.version)
  }

  /**
   * Query builder Search
   * @link https://knexjs.org/guide/query-builder.html
   */
  /* c8 ignore next 4 coverage coved, but not included */
  search<T extends object = object>(tableName: string): Knex.QueryBuilder<T, T[]> {
    const builder = this.dbh(tableName)
    return builder as Knex.QueryBuilder<T, T[]>
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

  async execute<T = unknown>(sql: string, params: unknown[], trx: Transaction | undefined | null): Promise<T> {
    const dbh = trx ?? this.dbh
    try {
      const res = await dbh.raw(sql, params) as T
      return res
    }
    /* c8 ignore start */
    catch (ex) {
      if (trx) {
        await trx.rollback()
      }
      console.error('sql:', sql)
      console.error('params:', params)
      throw ex
    }
    /* c8 ignore stop */
  }

  /**
   * Close the db connection
   */
  async destroy(): Promise<void> {
    await this.dbh.destroy()
  }

}


function createDbh(knexConfig: DbConfig): Knex {
  const inst = _knex(knexConfig)
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

