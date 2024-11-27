import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import {
  type CreateBm25Options,
  type DropBm25Options,
  type IndexSchemaDto,
  IndexManager,
  genRandomName,
} from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'

import { f3, options } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  const textFields: CreateBm25Options['textFields'] = [f3]

  // eslint-disable-next-line import/no-named-as-default-member
  const dbh = _knex.knex(dbConfig)
  assert(dbh)
  const idx = new IndexManager(dbh, dbConfig.version)
  assert(idx)

  before(async () => {
    const opts: CreateBm25Options = {
      ...options,
      indexName: idxName,
      textFields,
      // for paradedb version >= 0.13
      columns: [f3.fieldName],
    }
    await idx.createBm25(opts)
  })
  after(async () => {
    await dbh.destroy()
  })

  describe(`Index.schema() ${idxName}`, () => {
    it('normal', async () => {
      const rows: IndexSchemaDto[] = await idx.schema({ indexName: idxName })
      assert(rows.length > 0)

      const found = rows.find((row) => {
        if (row.name === f3.fieldName) {
          assert(row.fast === f3.fast)
          assert(row.fieldType === 'Str')
          assert(row.fieldnorms === f3.fieldnorms)
          assert(row.indexed === f3.indexed)
          // assert(row.normalizer === f1.normalizer)
          assert(row.record === f3.record)
          assert(row.stored === f3.stored)
          return true
        }
      })
      assert(found, `Not found: ${idxName}`)
    })

    it('not found', async () => {
      await idx.dropBm25({ indexName: idxName })

      const rows: IndexSchemaDto[] = await idx.schema({ indexName: idxName })
      assert(! rows.length, 'Not empty')
    })
  })

})

