import type { OptionsBase } from '../types.js'

import type {
  ArrayFieldsDo,
  BooleanFieldsDo,
  DatetimeFieldsDo,
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

