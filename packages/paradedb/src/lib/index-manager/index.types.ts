/* c8 ignore start */
import type { RecordCamelKeys } from '@waiting/shared-types'

import type { OptionsBase } from '../types.js'

import type {
  ArrayFieldsDo,
  BooleanFieldsDo,
  DatetimeFieldsDo,
  IndexSchemaDo,
  JsonFieldsDo,
  NumericFieldsDo,
  TextFieldsDo,
} from './index.do.js'


/**
 * Create an Index
 * @link https://docs.paradedb.com/documentation/indexing/create_index
 */
export interface CreateBm25Options extends OptionsBase {
  indexName: string
  tableName: string
  keyField: string
  /**
   * @default CURRENT SCHEMA
   */
  schemaName?: string
  /**
   * pass raw string like "paradedb.field('description') || paradedb.field('category')"
   */
  textFields?: TextFieldsDo | ArrayFieldsDo<TextFieldsDo> | string
  numericFields?: NumericFieldsDo | ArrayFieldsDo<NumericFieldsDo> | string
  booleanFields?: BooleanFieldsDo | ArrayFieldsDo<BooleanFieldsDo> | string
  datetimeFields?: DatetimeFieldsDo | ArrayFieldsDo<DatetimeFieldsDo> | string
  jsonFields?: JsonFieldsDo | string
}

/**
 * Drop an Index
 * @link https://docs.paradedb.com/documentation/indexing/delete_index
 */
export interface DropBm25Options extends OptionsBase {
  indexName: string
  /**
   * @default CURRENT SCHEMA
   */
  schemaName?: string
}

/**
 * The `schema` function returns a table with information about the index schema.
 * This is useful for inspecting how an index was configured.
 * @link https://docs.paradedb.com/documentation/indexing/inspect_index
 */
export interface IndexSchemaOptions extends OptionsBase {
  indexName: string
}


export type IndexSchemaDto = RecordCamelKeys<IndexSchemaDo>

/* c8 ignore stop */
