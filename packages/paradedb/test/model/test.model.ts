import { genDbDict } from 'kmore-types'


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

