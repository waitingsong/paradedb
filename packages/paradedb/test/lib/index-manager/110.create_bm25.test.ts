import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import { type CreateBm25Options, type TextFieldsDo, type Transaction, IndexManager, genRandomName } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  let trx: Transaction

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

  before(async () => {
    trx = await idx.startTransaction()
  })
  after(async () => {
    await trx.rollback()
    await dbh.destroy()
  })

  describe(`paradedb.create_bm25 ${idxName}`, () => {
    it('normal', async () => {
      assert(trx, 'trx not exists')
      const options: CreateBm25Options = {
        indexName: idxName,
        tableName: 'mock_items',
        keyField: 'id',
        textFields,
        trx,
      }
      await idx.createBm25(options)
    })
  })

})

