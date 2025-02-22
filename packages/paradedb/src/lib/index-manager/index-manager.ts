import assert from 'node:assert'

import { camelKeys } from '@waiting/shared-core'
import semver from 'semver'

import type { Knex, QueryResponse, Transaction } from '../knex.types.js'

import { IndexManager011 } from './index-manager-011.js'
import { IndexManager012 } from './index-manager-012.js'
import { IndexManager013 } from './index-manager-013.js'
import { IndexManager014 } from './index-manager-014.js'
import type { IndexSchemaDo, IndexSizeDo } from './index.do.js'
import { IndexSql } from './index.sql.js'
import type {
  CreateBm25Options,
  DropBm25Options,
  IndexSchemaDto,
  IndexSchemaOptions,
  IndexSizeOptions,
} from './index.types.js'


export class IndexManager {
  version: string
  isDb011 = false
  isDb012 = false
  isDb013 = false
  isDb014 = false

  indexManager011: IndexManager011
  indexManager012: IndexManager012
  indexManager013: IndexManager013
  indexManager014: IndexManager014

  /**
   * $PARADEDB_VER
   * - '_bm25_index' for paradedb v0.11.0
   * - '' for paradedb v0.12.0
   */
  indexSuffix = ''

  constructor(
    protected readonly dbh: Knex,
    version?: string,
  ) {
    this.version = version ?? ''
    if (this.version === 'latest') {
      this.version = ''
    }
    if (this.version) {
      this.setVersionFlag(this.version)
    }
    this.indexManager011 = new IndexManager011(dbh)
    this.indexManager012 = new IndexManager012(dbh)
    this.indexManager013 = new IndexManager013(dbh)
    this.indexManager014 = new IndexManager014(dbh)
  }

  // #region createBm25

  /**
   * Create an Index
   * @link https://docs.paradedb.com/documentation/indexing/create_index
   */
  async createBm25(options: CreateBm25Options): Promise<void> {
    await this.initVersion()

    if (this.isDb014) {
      assert(options.columns, 'columns is required')
      return this.indexManager014.createBm25New(options)
    }
    if (this.isDb013) {
      assert(options.columns, 'columns is required')
      return this.indexManager013.createBm25New(options)
    }
    if (this.isDb012) {
      delete options.columns
      return this.indexManager012.createBm25(options)
    }
    if (this.isDb011) {
      delete options.columns
      return this.indexManager011.createBm25(options)
    }

    throw new Error(`Not implemented for version ${this.version}`)
  }

  // #region dropBm25

  /**
   * Drop an Index
   * @link https://docs.paradedb.com/documentation/indexing/delete_index
   */
  async dropBm25(options: DropBm25Options): Promise<void> {
    await this.initVersion()

    if (this.isDb012) {
      return this.indexManager012.dropBm25(options)
    }
    if (this.isDb011) {
      return this.indexManager011.dropBm25(options)
    }

    return this.indexManager013.dropBm25New(options)
  }

  // #region schema

  /**
   * The `schema` function returns a table with information about the index schema.
   * This is useful for inspecting how an index was configured.
   * @link https://docs.paradedb.com/documentation/indexing/inspect_index
   */
  async schema(options: IndexSchemaOptions): Promise<IndexSchemaDto[]> {
    await this.initVersion()
    const { trx, indexName } = options
    assert(indexName, 'indexName is required')
    const sql = IndexSql.IndexSchema
    const data = [`${indexName}${this.indexSuffix}`]
    try {
      const res = await this.execute<QueryResponse<IndexSchemaDo>>(sql, data, trx)
      const ret = res.rows.length ? res.rows.map(row => camelKeys(row)) : []
      return ret
    }
    catch (ex) {
      assert(ex instanceof Error, 'ex not an instance of Error')
      if (ex.message.includes('does not exist')) {
        return []
      }
      /* c8 ignore next 2 */
      throw ex
    }
  }


  // #region size

  /**
   * Get the size of an index in bytes,
   * return zero if the index does not exist.
   * @link https://docs.paradedb.com/documentation/indexing/inspect_index#index-size
   */
  async size(options: IndexSizeOptions): Promise<bigint> {
    await this.initVersion()

    if (this.isDb014 || ! this.version) {
      return this.indexManager014.size(options)
    }

    const { trx, indexName } = options
    assert(indexName, 'indexName is required')
    const sql = IndexSql.IndexSize
    const data = [`${indexName}${this.indexSuffix}`]
    try {
      const res = await this.execute<QueryResponse<IndexSizeDo>>(sql, data, trx)
      const ret = res.rows[0]?.index_size ? BigInt(res.rows[0]?.index_size) : 0n
      return ret
    }
    catch (ex) {
      assert(ex instanceof Error, 'ex not an instance of Error')
      if (ex.message.includes('does not exist')) {
        return 0n
      }
      /* c8 ignore next 2 */
      throw ex
    }
  }

  /**
   * The scores generated by the BM25 index may be influenced by dead rows that have not been cleaned up by the VACUUM process
   * @link https://docs.paradedb.com/documentation/full-text/scoring#score-refresh
   */
  async refreshScore(tableName: string) {
    assert(tableName, 'tableName is required')
    const sql = IndexSql.RefreshScore
    const query = sql.replace('$TABLE_NAME', tableName)
    await this.execute(query, [], null)
  }


  async execute<T = unknown>(sql: string, params: unknown[], trx: Transaction | undefined | null): Promise<T> {
    const dbh = trx ?? this.dbh
    try {
      const res = await dbh.raw(sql, params) as T
      return res
    }
    catch (ex) {
      if (trx) {
        await trx.rollback()
      }
      console.error('sql:', sql)
      console.error('params:', params)
      throw ex
    }
  }

  async startTransaction(): Promise<Transaction> {
    const ret = await this.dbh.transaction()
    assert(ret, 'Transaction is required')
    return ret
  }

  /**
   * Get the version of pg_search extension
   * @returns version string eg. "0.13.0"
   */
  async getSearchVersion(): Promise<string> {
    const res = await this.execute<QueryResponse<{ extversion: string }>>(
      'SELECT extname, extversion FROM pg_extension WHERE extname = ?',
      ['pg_search'],
      null,
    )
    const [row] = res.rows
    assert(row, 'pg_search not found')
    return row.extversion
  }


  private async initVersion() {
    if (this.version) { return }
    this.version = await this.getSearchVersion()
    this.setVersionFlag(this.version)
  }

  private setVersionFlag(version: string) {
    assert(version, 'version is required')
    const ver = semver.coerce(version)
    assert(ver, 'Invalid parade db search version: ' + version)

    if (semver.gte(ver, '0.14.0')) {
      this.isDb014 = true
      return
    }

    if (semver.gte(ver, '0.13.0')) {
      this.isDb013 = true
      return
    }

    if (semver.gte(ver, '0.12.0')) {
      this.isDb012 = true
      this.indexSuffix = ''
      return
    }

    if (semver.gte(ver, '0.11.0')) {
      this.isDb011 = true
      this.indexSuffix = '_bm25_index'
      return
    }
  }

}


