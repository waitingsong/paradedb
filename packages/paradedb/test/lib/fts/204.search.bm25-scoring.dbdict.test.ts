import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import {
  type CreateBm25Options,
  type IndexSchemaDto,
  ParadeDb,
} from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'
import { type MockItemsDo2, dbDict } from '#@/model/test.model.js'

import { f1, f2, f3 } from './test.search.js'


// https://docs.paradedb.com/documentation/full-text/scoring

describe(fileShortPath(import.meta.url), () => {
  const idxName = 'search_idx'
  const textFields: CreateBm25Options['textFields'] = [f1, f2]

  const pdb = new ParadeDb('test', dbConfig)
  assert(pdb)

  before(async () => {
    await pdb.index.dropBm25({ indexName: 'search_idx' })
    const options: CreateBm25Options = {
      indexName: idxName,
      tableName: 'mock_items',
      keyField: 'id',
      textFields,
      // for paradedb version >= 0.13
      columns: [f1.fieldName, f2.fieldName],
    }
    await pdb.index.createBm25(options)

    await pdb.index.dropBm25({ indexName: 'orders_idx' })
    const opts2: CreateBm25Options = {
      indexName: 'orders_idx',
      tableName: dbDict.tables.orders,
      keyField: dbDict.columns.orders.order_id,
      textFields: f3,
      // for paradedb version >= 0.13
      columns: [f3.fieldName],
    }
    await pdb.index.createBm25(opts2)

    const rows: IndexSchemaDto[] = await pdb.index.schema({ indexName: idxName })
    assert(rows.length > 0, `Index not found: ${idxName}`)
  })
  after(async () => {
    await pdb.index.dropBm25({ indexName: idxName })
    await pdb.index.dropBm25({ indexName: 'order_idx' })
    await pdb.destroy()
  })

  describe(`Paradedb.search() ${idxName}`, () => {
    const tbl = dbDict.tables.mock_items

    it('Basic Usage', async () => {
      const columns = dbDict.columns.mock_items
      const limit = 1
      const k1 = 'shoes'
      const col1 = columns.id
      const col2 = columns.description
      const orderBy = columns.id

      const rows = await pdb.search<MockItemsDo2>(tbl)
        .select(col1, col2)
        .select({
          score: pdb.dbh.raw('paradedb.score(:col:)', { col: col1 }),
        })
        .whereRaw(`:col2: @@@ :k1`, { col2, k1 })
        .orderBy(orderBy, 'desc')
        .limit(limit)

      assert(rows.length === limit, `rows.length: ${rows.length}`)
      console.log({ rows })
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes(k1), row.description)
      assert(typeof row.score === 'number')
      assert(row.score > 0)
    })

    // https://docs.paradedb.com/documentation/full-text/sorting#order-by-relevance
    it('Order by Relevance', async () => {
      const columns = dbDict.columns.mock_items2
      const limit = 1
      const k1 = 'shoes'
      const col1 = columns.id
      const col2 = columns.description
      const orderBy = columns.score

      const rows = await pdb.search<MockItemsDo2>(tbl)
        .select(col1, col2)
        .select({
          score: pdb.dbh.raw('paradedb.score(:col:)', { col: col1 }),
        })
        .whereRaw(`:col2: @@@ :k1`, { col2, k1 })
        .orderBy(orderBy, 'desc')
        .limit(limit)

      assert(rows.length === limit, `rows.length: ${rows.length}`)
      console.log({ rows })
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes(k1), row.description)
      assert(typeof row.score === 'number')
      assert(row.score > 0)
    })
  })

})

