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

  const f1: TextFieldsDo = {
    fieldName: 'description',
    indexed: true,
    stored: false,
    record: 'position',
    normalizer: 'raw',
  }
  const f2: TextFieldsDo = {
    fieldName: 'category',
    indexed: false,
    stored: true,
    record: 'basic',
  }

  describe(`IndexManager.parseCreateBm25Options()`, () => {
    it('with textFields: ArrayFieldsObject<TextFields> only one item', async () => {
      const opts: CreateBm25Options = {
        ...options,
        textFields: [f1],
      }
      const [ids, data] = idx.parseCreateBm25Options(opts)
      const expectedIds = [
        ...expectedIdsBase,
        'text_fields => paradedb.field(?, indexed => ?, stored => ?, record => ?, normalizer => ?)',
      ]
      const expectedData = [
        ...expectedDataBase,
        'description',
        true,
        false,
        'position',
        'raw',
      ]
      assert.deepStrictEqual(ids, expectedIds)
      assert.deepStrictEqual(data, expectedData)
    })

    it('with textFields: ArrayFieldsObject<TextFields> two items', async () => {
      const textFields: CreateBm25Options['textFields'] = [f1, f2]
      const opts: CreateBm25Options = {
        ...options,
        textFields,
      }
      const [ids, data] = idx.parseCreateBm25Options(opts)

      const tf = [
        'text_fields => paradedb.field(?, indexed => ?, stored => ?, record => ?, normalizer => ?)',
        'paradedb.field(?, indexed => ?, stored => ?, record => ?)',
      ]
      const expectedIds = [
        ...expectedIdsBase,
        tf.join(' || '),
      ]
      const expectedData = [
        ...expectedDataBase,
        'description',
        true,
        false,
        'position',
        'raw',

        'category',
        false,
        true,
        'basic',
      ]
      assert.deepStrictEqual(ids, expectedIds)
      assert.deepStrictEqual(data, expectedData)
    })
  })

})

