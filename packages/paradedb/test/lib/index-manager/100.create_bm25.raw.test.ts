import assert from 'node:assert'

import { fileShortPath } from '@waiting/shared-core'
import _knex from 'knex'

import { type Transaction, IndexManager, genRandomName } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'


describe(fileShortPath(import.meta.url), () => {
  const idxName = genRandomName(6)
  let trx: Transaction

  // eslint-disable-next-line import/no-named-as-default-member
  const dbh = _knex.knex(dbConfig)
  assert(dbh)
  const idx = new IndexManager(dbh)
  assert(idx)

  const sql = `
        CALL paradedb.create_bm25(
          index_name => ?,
          table_name => ?,
          key_field => ?,
          text_fields => paradedb.field(?, indexed => ?, record => ?),
          schema_name => ?
        );
      `
  const data = [
    idxName,
    'mock_items',
    'id',
    'description',
    true,
    'position',
    'public',
  ]

  before(async () => {
    trx = await idx.startTransaction()
  })
  after(async () => {
    await trx.rollback()
    await dbh.destroy()
  })

  describe(`paradedb.create_bm25 ${idxName}`, () => {
    it('normal', async () => {
      await idx.execute(sql, data, trx)
    })

    it('duplicate creation', async () => {
      try {
        await idx.execute(sql, data, trx)
      }
      catch (ex) {
        assert(ex instanceof Error)
        assert(
          (ex.message.includes('a relation may only have one') && ex.message.includes('USING bm25'))
          || (ex.message.includes('already exists') || ex.message.includes(idxName)),
          ex.message,
        )
        assert(trx.isCompleted())
        trx = await idx.startTransaction()
        return
      }
      assert(false, 'should not reach here')
    })
  })

  describe('paradedb.drop_bm25', () => {
    it('normal', async () => {
      await idx.execute(sql, data, trx)

      const sql2 = `
        CALL paradedb.drop_bm25(
          index_name => ?
        );
      `
      const data2 = [idxName]
      await idx.execute(sql2, data2, trx)
    })
  })

})

