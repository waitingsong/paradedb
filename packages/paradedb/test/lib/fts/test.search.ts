import type { CreateBm25Options, TextFieldsDo } from '##/index.js'
import { dbDict } from '#@/model/test.model.js'


export const cols = dbDict.columns.mock_items
export const cols2 = dbDict.columns.mock_items2

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
  stored: true,
}
export const f2: TextFieldsDo = {
  fieldName: cols.category,
  indexed: true,
  stored: true,
}
// order
export const f3: TextFieldsDo = {
  fieldName: 'customer_name',
}

