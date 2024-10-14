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

import { f3 } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  const textFields: CreateBm25Options['textFields'] = [f3]

  // eslint-disable-next-line import/no-named-as-default-member
  const dbh = _knex.knex(dbConfig)
  assert(dbh)
  const idx = new IndexManager(dbh)
  assert(idx)

  before(async () => {
    const options: CreateBm25Options = {
      indexName: idxName,
      tableName: 'mock_items',
      keyField: 'id',
      textFields,
    }
    await idx.createBm25(options)
  })
  after(async () => {
    const options: DropBm25Options = { indexName: idxName }
    await idx.dropBm25(options)
    await dbh.destroy()
  })

  describe(`Index.size() ${idxName}`, () => {
    it('normal', async () => {
      const size: bigint = await idx.size({ indexName: idxName })
      assert(size > 0)
      assert(typeof size === 'bigint')
    })

    it('not found', async () => {
      const options: DropBm25Options = { indexName: idxName }
      await idx.dropBm25(options)

      const size = await idx.size({ indexName: idxName })
      assert(size === 0n)
      assert(! size)
    })
  })

})

