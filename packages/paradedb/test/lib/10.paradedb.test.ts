import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import { IndexManager, ParadeDb } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'


describe(fileShortPath(import.meta.url), () => {
  let pdb: ParadeDb
  before(async () => {
    pdb = new ParadeDb('test', dbConfig)
    assert(pdb)
    assert(pdb.index)
    assert(pdb.index instanceof IndexManager)
  })
  after(async () => {
    await pdb.destroy()
  })

  describe(`Paradedb`, () => {
    it(`getCurrentTime()`, async () => {
      const ret = await pdb.getCurrentTime()
      assert(ret instanceof Date, 'getCurrentTime failed:')
    })

    it(`setTimeZone()`, async () => {
      const flag = await pdb.setTimeZone('UTC')
      assert(flag === 'UTC', 'setTimeZone failed:' + flag)
    })
  })
})

