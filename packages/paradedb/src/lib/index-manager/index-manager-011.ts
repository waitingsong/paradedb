/* eslint-disable max-depth */
import assert from 'node:assert'

import { camelToSnake } from '@waiting/shared-core'

import type { Knex, Transaction } from '../knex.types.js'

import type { ArrayFieldsDo, FieldsDoBase } from './index.do.js'
import { IndexSql } from './index.sql.js'
import type {
  CreateBm25Options,
  DropBm25Options,
} from './index.types.js'


export class IndexManager011 {

  indexSuffix = '_bm25_index'
  fieldsKey = ['textFields', 'numericFields', 'booleanFields', 'datetimeFields', 'jsonFields']

  constructor(protected readonly dbh: Knex) { }


  // #region createBm25

  /**
   * Create an Index
   * @link https://docs.paradedb.com/documentation/indexing/create_index
   */
  async createBm25(options: CreateBm25Options): Promise<void> {
    const { trx } = options
    const sql = IndexSql.create_bm25

    const [ids, data] = this.parseCreateBm25Options(options)
    const param = '\n' + ids.join(',\n') + '\n'
    const query = sql.replace('$PARAMS', param)
    await this.execute(query, data, trx)
  }

  parseCreateBm25Options(options: CreateBm25Options): [string[], unknown[]] {
    const ids: string[] = []
    const data: unknown[] = []

    // { indexName => 'search_idx',
    //   tableName => 'mock_items',
    //   keyField => 'id',
    //   numericFields => paradedb.field('rating', indexed => true)
    // }
    for (const [key, val] of Object.entries(options)) {
      if (typeof val === 'undefined') { continue }

      const key2 = camelToSnake(key)
      // escape single quote
      const key2Escaped = key2.replace(/'/gu, '\'\'')

      if (this.fieldsKey.includes(key)) {

        if (typeof val === 'string') {
          ids.push(`${key2} => ${val}`)
          data.push(null) // raw string, no need to bind
        }
        else if (typeof val === 'object') {
          const items = val as FieldsDoBase | ArrayFieldsDo

          if (Array.isArray(items)) {
            assert(items.length > 0, 'ArrayFieldsDo empty')

            if (items.length === 1) { // one item ignore operator
              const [subItem] = items
              assert(subItem, 'ArrayFieldsObjectDo.values[0] undefined')
              const [fieldName, map] = this.convertFieldsItemSimpleToMap(subItem)

              const txt = `${key2} => paradedb.field(?` // fieldName
              data.push(fieldName)

              const arr: string[] = []
              map.forEach((v, k) => {
                arr.push(`${k} => ?`)
                data.push(v)
              })

              if (arr.length) {
                const txt2 = arr.join(', ')
                ids.push(`${txt}, ${txt2})`)
              }
              else {
                ids.push(`${txt})`)
              }
            }
            else { // multiple items
              // text_fields => paradedb.field('description') || paradedb.field('category'),
              const tmpIds: string[] = []
              for (const subItem of items) {
                const [fieldName, map] = this.convertFieldsItemSimpleToMap(subItem)

                const txt = `paradedb.field(?` // fieldName
                data.push(fieldName)

                const arr: string[] = []
                map.forEach((v, k) => {
                  arr.push(`${k} => ?`)
                  data.push(v)
                })

                if (arr.length) {
                  const txt2 = arr.join(', ')
                  tmpIds.push(`${txt}, ${txt2})`)
                }
                else {
                  tmpIds.push(`${txt})`)
                }
              }

              ids.push(`${key2} => ` + tmpIds.join(' || '))
            }
          }
          else {
            const [fieldName, map] = this.convertFieldsItemSimpleToMap(items)

            const txt = `${key2} => paradedb.field(?` // fieldName
            data.push(fieldName)

            const arr: string[] = []
            map.forEach((v, k) => {
              arr.push(`${k} => ?`)
              data.push(v)
            })
            if (arr.length > 0) {
              const txt2 = arr.join(', ')
              ids.push(`${txt}, ${txt2})`)
            }
            else {
              ids.push(`${txt})`)
            }
          }
        }
        /* c8 ignore next 3 */
        else {
          throw new TypeError(`Unknown type: ${typeof val}`)
        }

        continue
      }
      else {
        switch (typeof val) {
          case 'string': {
            ids.push(`${key2Escaped} => ?`)
            data.push(val)
            break
          }

          /* c8 ignore next 2 */
          case 'function': // trx
            break

          /* c8 ignore next 2 */
          default:
            throw new TypeError(`Unknown type: ${typeof val} of ${key} in options`)
        }
      }
    } // end for

    return [ids, data]
  }


  protected convertFieldsItemSimpleToMap(options: FieldsDoBase): [string, FieldsParamMap] {
    const { fieldName } = options
    assert(fieldName, 'fieldName undefined')

    const ret: FieldsParamMap = new Map()

    // paradedb.field('description', indexed => true, stored => true)
    // Map<[[indexed, true], [stored, true]]>
    for (const [key, val] of Object.entries(options)) {
      if (key === 'fieldName') { continue }
      const key2 = camelToSnake(key)

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (typeof val) {
        case 'string': {
          ret.set(key2, val)
          break
        }

        case 'boolean': {
          ret.set(key2, val)
          break
        }

        /* c8 ignore next 2 */
        case 'undefined':
          continue

        /* c8 ignore next 2 */
        default:
          throw new TypeError(`Unknown type: ${typeof val}, key: ${key}`)
      }
    }

    return [fieldName, ret]
  }


  // #region dropBm25

  /**
   * Drop an Index
   * @link https://docs.paradedb.com/documentation/indexing/delete_index
   */
  async dropBm25(options: DropBm25Options): Promise<void> {
    const { trx } = options
    const sql = IndexSql.drop_bm25

    const [ids, data] = this.parseDropBm25Options(options)
    const param = '\n' + ids.join(',\n') + '\n'
    const query = sql.replace('$PARAMS', param)
    await this.execute(query, data, trx)
  }

  parseDropBm25Options(options: DropBm25Options): [string[], unknown[]] {
    const ids: string[] = []
    const data: unknown[] = []

    // { indexName => 'search_idx',
    //   schema_name => 'public'
    // }
    for (const [key, val] of Object.entries(options)) {
      if (typeof val === 'undefined') { continue }

      const key2 = camelToSnake(key)
      // escape single quote
      const key2Escaped = key2.replace(/'/gu, '\'\'')

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (typeof val) {
        case 'string': {
          ids.push(`${key2Escaped} => ?`)
          data.push(val)
          break
        }

        /* c8 ignore next 2 */
        case 'function': // trx
          break

          /* c8 ignore next 2 */
        default:
          throw new TypeError(`Unknown type: ${typeof val} of ${key} in options`)
      }
    } // end for

    return [ids, data]
  }


  async execute<T = unknown>(sql: string, params: unknown[], trx: Transaction | undefined | null): Promise<T> {
    const dbh = trx ?? this.dbh
    try {
      const res = await dbh.raw(sql, params) as T
      return res
    }
    catch (ex) {
      if (trx) {
        await trx.rollback()
      }
      console.error('sql:', sql)
      console.error('params:', params)
      throw ex
    }
  }

  async startTransaction(): Promise<Transaction> {
    const ret = await this.dbh.transaction()
    assert(ret, 'Transaction is required')
    return ret
  }

}

type FieldsParamMap = Map<string, string | boolean | number>

