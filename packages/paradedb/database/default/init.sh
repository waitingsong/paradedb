#!/bin/bash
set -e

echo -e "\n"

PGPASSWORD="$PARADEDB_PASSWORD"
psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d $PARADEDB_DB -bq \
  -f ddl/create-example-table.sql


