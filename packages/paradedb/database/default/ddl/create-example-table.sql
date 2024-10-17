-- https://docs.paradedb.com/documentation/getting-started/quickstart
--
CALL paradedb.create_bm25_test_table(
  schema_name => 'public',
  table_name => 'mock_items'
);
ALTER TABLE mock_items ADD COLUMN embedding vector(3);

CALL paradedb.create_bm25_test_table(
  schema_name => 'public',
  table_name => 'orders',
  table_type => 'Orders'
);

ALTER TABLE orders
ADD CONSTRAINT foreign_key_product_id
FOREIGN KEY (product_id)
REFERENCES mock_items(id);
