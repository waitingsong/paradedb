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
import type { QueryResponse } from '##/lib/knex.types.js'
import { dbConfig } from '#@/config.unittest.js'
import type { MockItemsDo } from '#@/model/test.model.js'

import { f1, f2 } from './test.search.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  const textFields: CreateBm25Options['textFields'] = [f1, f2]

  const pdb = new ParadeDb('test', dbConfig)

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

    const rows: IndexSchemaDto[] = await pdb.index.schema({ indexName: idxName })
    assert(rows.length > 0, `Index not found: ${idxName}`)
  })
  after(async () => {
    const options: DropBm25Options = { indexName: idxName }
    await pdb.index.dropBm25(options)
    await pdb.destroy()
  })

  describe(`search ${idxName}`, () => {
    const k1 = 'keyboard'
    const k2 = 'shoes'

    it('raw', async () => {
      const sql = `SELECT * FROM mock_items WHERE description @@@ ? ORDER BY ? LIMIT ? OFFSET ?`
      const res = await pdb.execute<QueryResponse<MockItemsDo>>(sql, [k1, 'id', 1, 0], null)
      const { rows } = res
      console.log({ rows })
      assert(rows.length === 1, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      assert(row.description.toLowerCase().includes(k1), row.description)
    })

    it('raw multi', async () => {
      const limit = 4
      const sql = `SELECT * FROM mock_items
      WHERE description @@@ ? OR description @@@ ?
      ORDER BY ? LIMIT ? OFFSET ?`

      const res = await pdb.execute<QueryResponse<MockItemsDo>>(sql, [k1, k2, 'id', limit, 0], null)
      const { rows } = res
      assert(rows.length <= limit, `rows.length: ${rows.length}`)
      const [row] = rows
      assert(row)
      assert(row.id)
      assert(row.description)
      const description = row.description.toLowerCase()
      assert(description.includes(k1) || description.includes(k2), row.description)
    })
  })

})

