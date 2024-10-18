import assert from 'node:assert'

import {
  Controller,
  Get,
  Inject,
} from '@midwayjs/core'
import { MConfig } from '@mwcp/share'
import type { Context } from '@mwcp/share'

import { createBm25Options, dbDict } from './test.model.js'
import { apiBase, apiMethod } from './types/api-test.js'
import { ParadeDbManager } from './types/lib-index.js'
import { ConfigKey } from './types/lib-types.js'
import type { Config, MiddlewareConfig } from './types/lib-types.js'
import type { RespData } from './types/root.config.js'


@Controller(apiBase.root)
export class HomeController {

  @MConfig(ConfigKey.config) protected readonly config: Config
  @MConfig(ConfigKey.middlewareConfig) protected readonly mwConfig: MiddlewareConfig

  @Inject() protected readonly db: ParadeDbManager

  @Get(`/${apiMethod.component}`)
  async home(ctx: Context): Promise<RespData> {
    const pdb = this.db.getDataSource('default')
    assert(pdb, 'should exist')
    assert(typeof pdb.search === 'function', 'should be function')

    await pdb.index.dropBm25({ indexName: createBm25Options.indexName })
    await pdb.index.createBm25(createBm25Options)

    const tbl = dbDict.tables.mock_items
    const cols = dbDict.columns.mock_items
    const builder = pdb.search(tbl)
      .whereRaw(`${cols.description} @@@ :k1`, { k1: 'keyboard' })
      .orderBy(cols.id, 'desc')
      .limit(1)

    // console.log(builder.toString())
    const rows = await builder.then()
    assert(rows.length === 1)

    await pdb.index.dropBm25({ indexName: createBm25Options.indexName })

    const {
      cookies,
      header,
      url,
    } = ctx

    const res = {
      cookies,
      header,
      url,
    }
    return res
  }

}

