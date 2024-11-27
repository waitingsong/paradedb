import assert from 'node:assert'

import type { Knex } from '../knex.types.js'

import { IndexManager011 } from './index-manager-011.js'
import type { CreateBm25Options, DropBm25Options } from './index.types.js'


export class IndexManager013 extends IndexManager011 {

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

}


