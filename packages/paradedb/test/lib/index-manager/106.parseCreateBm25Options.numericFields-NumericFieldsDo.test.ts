import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import type { Knex } from 'knex'

import { type CreateBm25Options, IndexManager } from '##/index.js'

import { expectedDataBase, expectedIdsBase, options } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const dbh = void 0 as unknown as Knex
  const idx = new IndexManager(dbh)

  describe(`IndexManager.parseCreateBm25Options()`, () => {
    it('with numericFields: NumericFieldsDo', async () => {
      const opts: CreateBm25Options = {
        ...options,
        numericFields: {
          fieldName: 'rating',
          indexed: true,
        },
      }
      const [ids, data] = idx.parseCreateBm25Options(opts)
      const expectedIds = [
        ...expectedIdsBase,
        'numeric_fields => paradedb.field(?, indexed => ?)',
      ]
      const expectedData = [
        ...expectedDataBase,
        'rating',
        true,
      ]
      assert.deepStrictEqual(ids, expectedIds)
      assert.deepStrictEqual(data, expectedData)
    })
  })
})

