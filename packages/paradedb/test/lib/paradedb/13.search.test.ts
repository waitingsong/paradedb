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

  describe(`Paradedb.search()`, () => {
    it(`normal`, async () => {
      const builder = pdb.search('mock_items').limit(1)
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const query = builder.toString()
      assert(query === 'select * from "mock_items" limit 1')
      const rows = await builder.then()
      assert(rows.length === 1, `rows.length: ${rows.length}`)
    })

    it(`invalid table name`, async () => {
      try {
        await pdb.search('FAKE').limit(1)
      }
      catch (ex) {
        assert(ex instanceof Error)
        assert(ex.message.includes('relation "FAKE" does not exist'), ex.message)
        return
      }
      assert(false, 'should throw Error')
    })
  })
})

