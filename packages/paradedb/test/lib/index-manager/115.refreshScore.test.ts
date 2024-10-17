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

import { f3 } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  const textFields: CreateBm25Options['textFields'] = [f3]

  // eslint-disable-next-line import/no-named-as-default-member
  const dbh = _knex.knex(dbConfig)
  assert(dbh)
  const idx = new IndexManager(dbh)
  assert(idx)

  const options: CreateBm25Options = {
    indexName: idxName,
    tableName: 'mock_items',
    keyField: 'id',
    textFields,
  }
  before(async () => {
    await idx.createBm25(options)
  })
  after(async () => {
    await idx.dropBm25({ indexName: idxName })
    await dbh.destroy()
  })

  describe(`Index.refreshScore() `, () => {
    it('normal', async () => {
      await idx.refreshScore(options.tableName)
    })
  })

})
