import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import type { Knex } from 'knex'

import { type CreateBm25Options, type TextFieldsDo, IndexManager } from '##/index.js'


describe(fileShortPath(import.meta.url), () => {
  const dbh = void 0 as unknown as Knex
  const idx = new IndexManager(dbh)
  const options: CreateBm25Options = {
    indexName: 'search_idx',
    tableName: 'mock_items',
    keyField: 'id',
  }
  const expectedIdsBase = ['index_name => ?', 'table_name => ?', 'key_field => ?']
  const expectedDataBase = [options.indexName, options.tableName, options.keyField]

  describe(`IndexManager.parseCreateBm25Options()`, () => {
    it('simple', async () => {
      const [ids, data] = idx.parseCreateBm25Options(options)
      const expectedIds = [...expectedIdsBase]
      const expectedData = [...expectedDataBase]
      assert.deepStrictEqual(ids, expectedIds)
      assert.deepStrictEqual(data, expectedData)
    })

  })

})

