import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import { type CreateBm25Options, IndexManager, genRandomName } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'

import { f1, f2, options } from './test.CreateBm25Options.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  const textFields: CreateBm25Options['textFields'] = [f1, f2]

  // eslint-disable-next-line import/no-named-as-default-member
  const dbh = _knex.knex(dbConfig)
  assert(dbh)
  const idx = new IndexManager(dbh, dbConfig.version)
  assert(idx)

  after(async () => {
    await dbh.destroy()
  })

  describe(`Index.createBm25() ${idxName}`, () => {
    it('normal', async () => {
      const opts: CreateBm25Options = {
        ...options,
        indexName: idxName,
        textFields,
      }
      await idx.createBm25(opts)

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

