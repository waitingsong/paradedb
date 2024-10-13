import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import { type CreateBm25Options, type TextFieldsDo, type Transaction, IndexManager, genRandomName } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)

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
  const textFields: CreateBm25Options['textFields'] = [f1, f2]


  // eslint-disable-next-line import/no-named-as-default-member
  const dbh = _knex.knex(dbConfig)
  assert(dbh)
  const idx = new IndexManager(dbh)
  assert(idx)

  after(async () => {
    await dbh.destroy()
  })

  describe(`Index.createBm25() ${idxName}`, () => {
    it('normal', async () => {
      const options: CreateBm25Options = {
        indexName: idxName,
        tableName: 'mock_items',
        keyField: 'id',
        textFields,
      }
      await idx.createBm25(options)

      const sql2 = `
        CALL paradedb.drop_bm25(
          index_name => ?
        );
      `
      const data2 = [idxName]
      await idx.execute(sql2, data2, null)
    })
  })

})

