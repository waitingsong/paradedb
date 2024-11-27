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
        // for paradedb version >= 0.13
        columns: [f1.fieldName, f2.fieldName],
      }
      await idx.createBm25(opts)

      await idx.dropBm25({ indexName: idxName })
    })
  })

})

