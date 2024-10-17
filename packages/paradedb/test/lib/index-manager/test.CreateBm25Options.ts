import type { CreateBm25Options, TextFieldsDo } from '##/index.js'
import { dbDict } from '#@/model/test.model.js'


export const cols = dbDict.columns.mock_items

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
  stored: true,
  record: 'position',
  normalizer: 'raw',
}
