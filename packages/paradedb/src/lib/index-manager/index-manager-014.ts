import assert from 'node:assert'

import type { Knex, QueryResponse } from '../knex.types.js'

import { IndexManager011 } from './index-manager-011.js'
import type { IndexSizeDo } from './index.do.js'
import { IndexSql } from './index.sql.js'
import type { CreateBm25Options, DropBm25Options, IndexSizeOptions } from './index.types.js'


export class IndexManager014 extends IndexManager011 {

  constructor(override readonly dbh: Knex) {
    super(dbh)
    this.indexSuffix = ''
  }

  // #region createBm25

  /**
   * Create an Index
   * @link https://docs.paradedb.com/documentation/indexing/create_index
   */
  async createBm25New(options: CreateBm25Options): Promise<void> {
    const { trx } = options

    const query = this.genCreateBm25Options(options)
    await this.execute(query, [], trx)
  }

  async dropBm25New(options: DropBm25Options): Promise<void> {
    const { trx } = options

    const schema = options.schemaName ? ` ${options.schemaName}.` : ''
    const query = `DROP INDEX IF EXISTS ${schema}${options.indexName}`
    await this.execute(query, [], trx)
  }

  private genCreateBm25Options(options: CreateBm25Options): string {
    // { indexName => 'search_idx',
    //   tableName => 'mock_items',
    //   keyField => 'id',
    //   columns => ['description', 'category']
    // }
    const { tableName, keyField, columns } = options
    assert(tableName, 'Missing tableName')
    assert(keyField, 'Missing keyField')
    assert(Array.isArray(columns), 'columns must be an array')
    assert(columns.length, 'Missing columns')
    const indexName = options.indexName ?? ''

    const sql = `CREATE INDEX ${indexName} ON ${tableName}
      USING bm25(${columns.join(',')})
      WITH (key_field = ${keyField})`

    // data.push(keyField)
    return sql
  }


  /**
   * Get the size of an index in bytes,
   * return zero if the index does not exist.
   * @link https://docs.paradedb.com/documentation/indexing/inspect_index#index-size
   */
  async size(options: IndexSizeOptions): Promise<bigint> {
    const { trx, indexName } = options
    assert(indexName, 'indexName is required')
    const sql = IndexSql.IndexSize014
    const data = [indexName]
    try {
      const res = await this.execute<QueryResponse<IndexSizeDo>>(sql, data, trx)
      const ret = res.rows[0]?.pg_relation_size ? BigInt(res.rows[0].pg_relation_size) : 0n
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
}


