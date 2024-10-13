import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import { IndexManager, ParadeDb } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'


describe(fileShortPath(import.meta.url), () => {

  describe(`Paradedb`, () => {
    it('normal', async () => {
      const paradedb = new ParadeDb('master', dbConfig)
      assert(paradedb)
      assert(paradedb.index)
      assert(paradedb.index instanceof IndexManager)
    })
  })
})

