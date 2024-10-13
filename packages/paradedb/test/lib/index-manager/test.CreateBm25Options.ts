import { type CreateBm25Options, type TextFieldsDo, IndexManager } from '##/index.js'


export const options: CreateBm25Options = {
  indexName: 'search_idx',
  tableName: 'mock_items',
  keyField: 'id',
}
export const expectedIdsBase = ['index_name => ?', 'table_name => ?', 'key_field => ?']
export const expectedDataBase = [options.indexName, options.tableName, options.keyField]

export const f1: TextFieldsDo = {
  fieldName: 'description',
  indexed: true,
  stored: false,
  record: 'position',
  normalizer: 'raw',
}
export const f2: TextFieldsDo = {
  fieldName: 'category',
  indexed: false,
  stored: true,
  record: 'basic',
}

