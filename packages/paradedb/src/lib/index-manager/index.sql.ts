
export enum IndexSql {
  /**
   * @link https://docs.paradedb.com/documentation/indexing/create_index#basic-usage
   */
  create_bm25 = 'CALL paradedb.create_bm25($PARAMS)',
  create_bm25_new = 'CREATE INDEX $index_name ON $table_name USING bm25 ($columns) WITH ($key_field)',
  /**
   * @link https://docs.paradedb.com/documentation/indexing/delete_index
   */
  drop_bm25 = 'CALL paradedb.drop_bm25($PARAMS)',
  /**
   * The `schema` function returns a table with information about the index schema.
   * This is useful for inspecting how an index was configured.
   * @link https://docs.paradedb.com/documentation/indexing/inspect_index
   */
  IndexSchema = 'SELECT * FROM paradedb.schema(?)',
  /**
   * @link https://docs.paradedb.com/documentation/indexing/inspect_index#index-size
   */
  IndexSize = 'SELECT * FROM paradedb.index_size(?)',
  IndexSize014 = 'SELECT pg_relation_size(?)',
  /**
   * @link https://docs.paradedb.com/documentation/full-text/scoring#score-refresh
   */
  RefreshScore = 'VACUUM $TABLE_NAME',
}

