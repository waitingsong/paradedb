import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import {
  type CreateBm25Options,
  type DropBm25Options,
  type IndexSchemaDto,
  ParadeDb,
  genRandomName,
} from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'

import type { MockItemsDo2, MockItemsDo } from './test.search.js'
import { f1, f2 } from './test.search.js'


// https://docs.paradedb.com/documentation/full-text/phrase

describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
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
    }
    await pdb.index.createBm25(options)

    const rows: IndexSchemaDto[] = await pdb.index.schema({ indexName: idxName })
    assert(rows.length > 0, `Index not found: ${idxName}`)
  })
  after(async () => {
    const options: DropBm25Options = { indexName: idxName }
    await pdb.index.dropBm25(options)
    await pdb.destroy()
  })

  describe(`Paradedb.search() ${idxName}`, () => {
    const tbl = 'mock_items'
    const col1 = 'description'
    const orderBy = 'id'

    it('Basic Usage', async () => {
      const limit = 1
      const k1 = '"plastic keyboard"'

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
      assert(description.includes(k1.replaceAll('"', '')), row.description)
    })

    it('Slop Operator', async () => {
      const limit = 4
      const k1 = '"ergonomic keyboard"~1'

      const rows = await pdb.search<MockItemsDo>(tbl)
        .whereRaw(`:col1: @@@ :k1`, { col1, k1 })
        .orderBy(orderBy)
        .limit(limit)

      assert(rows.length <= limit, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes('ergonomic metal keyboard'), row.description)
    })

    it('Phrase Prefix', async () => {
      const limit = 1
      const k1 = '"plastic keyb"*'

      const rows = await pdb.search<MockItemsDo>(tbl)
        .whereRaw(`:col1: @@@ :k1`, { col1, k1 })
        .orderBy(orderBy)
        .limit(limit)

      assert(rows.length <= limit, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes('plastic keyboard'), row.description)
    })

  })

})

