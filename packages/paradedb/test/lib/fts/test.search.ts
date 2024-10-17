import { type CreateBm25Options, type TextFieldsDo } from '##/index.js'


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
  stored: true,
}
export const f2: TextFieldsDo = {
  fieldName: 'category',
  indexed: true,
  stored: true,
}
// order
export const f3: TextFieldsDo = {
  fieldName: 'customer_name',
}

export class MockItemsDo {
  id: number
  description: string
  category: string
  rating: number
  in_stock: boolean
  metadata: Record<string, unknown>
  created_at: Date
  last_updated_date: Date
  latest_available_time: string
}

export class MockItemsDo2 extends MockItemsDo {
  score: number
}
