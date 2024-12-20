import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import {
  type CreateBm25Options,
  type IndexSchemaDto,
  ParadeDb,
  genRandomName,
} from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'
import { type MockItemsDo, dbDict } from '#@/model/test.model.js'

import { cols, f1, f2, options } from './test.search.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  const textFields: CreateBm25Options['textFields'] = [f1, f2]

  const pdb = new ParadeDb('test', dbConfig)
  assert(pdb)

  before(async () => {
    await pdb.index.dropBm25({ indexName: 'search_idx' })
    const opts: CreateBm25Options = {
      ...options,
      indexName: idxName,
      textFields,
      // for paradedb version >= 0.13
      columns: [f1.fieldName, f2.fieldName],
    }
    await pdb.index.createBm25(opts)

    const rows: IndexSchemaDto[] = await pdb.index.schema({ indexName: idxName })
    assert(rows.length > 0, `Index not found: ${idxName}`)
  })
  after(async () => {
    await pdb.index.dropBm25({ indexName: idxName })
    await pdb.destroy()
  })

  describe(`Paradedb.search() ${idxName}`, () => {
    const tbl = dbDict.tables.mock_items
    const col1 = cols.description
    const k1 = 'keyboard'
    const k2 = 'shoes'
    const orderBy = cols.id

    it('Basic Usage', async () => {
      const limit = 1

      const rows = await pdb.search<MockItemsDo>(tbl)
        .whereRaw(`:col1: @@@ :k1`, { col1, k1 })
        .orderBy(orderBy, 'desc')
        .limit(limit)

      assert(rows.length === limit, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes(k1), row.description)
    })

    it('Multi Terms', async () => {
      const limit = 4

      const rows = await pdb.search<MockItemsDo>(tbl)
        // .whereRaw(`${col1} @@@ ? OR ${col1} @@@ ?`, [k1, k2]) // works
        .whereRaw(`:col1: @@@ :k1 OR :col1: @@@ :k2`, { col1, k1, k2 })
        .orderBy(orderBy)
        .limit(limit)

      assert(rows.length <= limit, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes(k1) || description.includes(k2), row.description)
    })

    // https://docs.paradedb.com/documentation/full-text/term#not-term
    it('Not Term', async () => {
      const limit = 4

      const builder = pdb.search<MockItemsDo>(tbl)
        .whereRaw(`:col1: @@@ :v1`, { col1, v1: 'shoes running -white' })
        .orderBy(orderBy)
        .limit(limit)
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      console.log('sql:', builder.toString())
      const rows = await builder.then()

      assert(rows.length <= limit, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes('shoes') || description.includes('running'), row.description)
      assert(! description.includes('white'), row.description)
    })
  })

})

