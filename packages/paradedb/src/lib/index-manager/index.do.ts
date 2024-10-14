/* c8 ignore start */

export interface FieldsDoBase {
  /**
   * Column name
   * @example description
   * @usage paradedb.field('description')
   */
  fieldName: string
  /**
   * @default true
   */
  indexed?: boolean
  /**
   * @default true
   */
  stored?: boolean
  /**
   * @default true
   */
  fast?: boolean
  [key: string]: string | boolean | TextFieldsDo | NumericFieldsDo | JsonFieldsDo | ArrayFieldsDo
}


/**
 * @link https://docs.paradedb.com/documentation/indexing/create_index#text-fields
 */
export interface TextFieldsDo extends FieldsDoBase {
  /**
   * @default true
   */
  fieldnorms?: boolean
  // /**
  //  * Not supported yet
  //  * @link https://docs.paradedb.com/documentation/indexing/tokenizers
  //  */
  // tokenizer?: unknown
  /**
   * @default position
   * @link https://docs.paradedb.com/documentation/indexing/record
   */
  record?: RecordType
  /**
   * The name of the tokenizer used for fast fields. This field is ignored unless fast=true
   * @default position
   * @link https://docs.paradedb.com/documentation/indexing/fast_fields#normalizers
   */
  normalizer?: NormalizerType
}


/**
 * @link https://docs.paradedb.com/documentation/indexing/record
 */
export type RecordType = 'basic' | 'freq' | 'position'

/**
 * @link https://docs.paradedb.com/documentation/indexing/fast_fields#normalizers
 */
export type NormalizerType = 'raw' | 'lowercase'


/**
 * @link https://docs.paradedb.com/documentation/indexing/create_index#numeric-fields
 */
export type NumericFieldsDo = FieldsDoBase

/**
 * @link https://docs.paradedb.com/documentation/indexing/create_index#boolean-fields
 */
export type BooleanFieldsDo = FieldsDoBase

/**
 * @link https://docs.paradedb.com/documentation/indexing/create_index#json-fields
 */
export interface JsonFieldsDo extends FieldsDoBase {
  /**
   * @default false
   */
  fast: boolean
  /**
   * @default true
   */
  expand_dots: boolean
  // /**
  //  * Not supported yet
  //  * @link https://docs.paradedb.com/documentation/indexing/tokenizers
  //  */
  // tokenizer: unknown
  /**
   * @default position
   * @link https://docs.paradedb.com/documentation/indexing/record
   */
  record: RecordType
  /**
   * The name of the tokenizer used for fast fields. This field is ignored unless fast=true
   * @default position
   * @link https://docs.paradedb.com/documentation/indexing/fast_fields#normalizers
   */
  normalizer: NormalizerType
}

/**
 * @link https://docs.paradedb.com/documentation/indexing/create_index#datetime-fields
 */
export type DatetimeFieldsDo = FieldsDoBase


/**
 * text_fields, numeric_fields, boolean_fields, and datetime_fields support array types.
 * For instance, columns of type TEXT[] can be passed into text_fields,
 * and columns of type INT[] can be passed into numeric_fields
 * @description The only exception are JSON[] and JSONB[] types, which are not yet supported.
 * @link https://docs.paradedb.com/documentation/indexing/create_index#array-fields
 */
export type ArrayFieldsDo<T extends TextFieldsDo | NumericFieldsDo = FieldsDoBase> = T[]


export interface IndexSchemaDo {
  name: string
  field_type: string
  stored: boolean
  indexed: boolean
  fast: boolean
  fieldnorms: boolean
  expand_dots: boolean | null
  // tokenizer: string | null
  record: RecordType
  normalizer: NormalizerType
}


/* c8 ignore stop */
