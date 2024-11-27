import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import {
  type CreateBm25Options,
  type DropBm25Options,
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
    await idx.dropBm25({ indexName: idxName })
    await dbh.destroy()
  })

  describe(`Index.size() ${idxName}`, () => {
    it('normal', async () => {
      const size: bigint = await idx.size({ indexName: idxName })
      assert(size > 0)
      assert(typeof size === 'bigint')
    })

    it('not found', async () => {
      await idx.dropBm25({ indexName: idxName })

      const size = await idx.size({ indexName: idxName })
      assert(size === 0n)
      assert(! size)
    })
  })

})

