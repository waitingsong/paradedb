
export enum IndexSql {
  /**
   * @link https://docs.paradedb.com/documentation/indexing/create_index#basic-usage
   */
  create_bm25 = 'CALL paradedb.create_bm25($PARAMS)',
  /**
   * @link https://docs.paradedb.com/documentation/indexing/delete_index
   */
  drop_bm25 = 'CALL paradedb.drop_bm25($PARAMS)',
}

