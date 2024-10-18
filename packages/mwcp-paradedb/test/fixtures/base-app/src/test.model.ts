import { type CreateBm25Options, type TextFieldsDo, genDbDict } from './types/index.js'


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

export class Orders {
  order_id: number
  product_id: number
  order_quantity: number
  /** numeric */
  order_total: string
  customer_name: string
}

export class Db {
  mock_items: MockItemsDo
  mock_items2: MockItemsDo2
  orders: Orders
}


export const dbDict = genDbDict<Db>()

export const cols = dbDict.columns.mock_items

const f1: TextFieldsDo = {
  fieldName: cols.description,
}
const f2: TextFieldsDo = {
  fieldName: cols.category,
}
export const createBm25Options: CreateBm25Options = {
  indexName: 'search_idx',
  tableName: dbDict.tables.mock_items,
  keyField: cols.id,
  textFields: [f1, f2],
}

