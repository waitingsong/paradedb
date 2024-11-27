import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import type { Knex } from 'knex'

import { type CreateBm25Options, IndexManager } from '##/index.js'
import { IndexManager012 } from '##/lib/index-manager/index-manager-012.js'
import { dbConfig } from '#@/config.unittest.js'

import { expectedDataBase, expectedIdsBase, options } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const dbh = void 0 as unknown as Knex
  const idx = new IndexManager012(dbh)

  describe(`IndexManager012.parseCreateBm25Options()`, () => {
    it('with textFields: string (raw)', async () => {
      const opts: CreateBm25Options = {
        ...options,
        textFields: 'paradedb.field(\'description\')',
      }
      const [ids, data] = idx.parseCreateBm25Options(opts)
      const expectedIds = [
        ...expectedIdsBase,
        'text_fields => paradedb.field(\'description\')',
      ]
      const expectedData = [
        ...expectedDataBase,
        null,
      ]
      assert.deepStrictEqual(ids, expectedIds)
      assert.deepStrictEqual(data, expectedData)
    })
  })
})

