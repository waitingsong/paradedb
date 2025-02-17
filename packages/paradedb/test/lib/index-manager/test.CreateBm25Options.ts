import assert from 'node:assert'

import semver from 'semver'

import type { CreateBm25Options, TextFieldsDo } from '##/index.js'
import { dbConfig } from '#@/config.unittest.js'
import { dbDict } from '#@/model/test.model.js'


export const cols = dbDict.columns.mock_items

const ver = dbConfig.version ? semver.coerce(dbConfig.version) : '0.14.0'
assert(ver, 'Invalid parade db search version')

// for generation test, not for create index
export const options: CreateBm25Options = {
  indexName: 'search_idx',
  tableName: dbDict.tables.mock_items,
  keyField: cols.id,
}
export const expectedIdsBase = ['index_name => ?', 'table_name => ?', 'key_field => ?']
export const expectedDataBase = [options.indexName, options.tableName, options.keyField]

export const f1: TextFieldsDo = {
  fieldName: cols.description,
  indexed: true,
  stored: false,
  record: 'position',
  normalizer: 'raw',
}
export const f2: TextFieldsDo = {
  fieldName: cols.category,
  indexed: false,
  stored: true,
  record: 'basic',
}

export const f3: TextFieldsDo = {
  fieldName: cols.description,
  fast: false,
  fieldnorms: true,
  indexed: true,
  stored: semver.gte(ver, '0.14.0') ? false : true,
  record: 'position',
  normalizer: 'raw',
}
