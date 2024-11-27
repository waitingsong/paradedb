import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import type { Knex } from 'knex'

import { IndexManager012 } from '##/lib/index-manager/index-manager-012.js'

import { expectedDataBase, expectedIdsBase, options } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const dbh = void 0 as unknown as Knex
  const idx = new IndexManager012(dbh)

  describe(`IndexManager012.parseCreateBm25Options()`, () => {
    it('simple', async () => {
      const [ids, data] = idx.parseCreateBm25Options(options)
      const expectedIds = [...expectedIdsBase]
      const expectedData = [...expectedDataBase]
      assert.deepStrictEqual(ids, expectedIds)
      assert.deepStrictEqual(data, expectedData)
    })
  })

})

