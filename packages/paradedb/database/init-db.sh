#!/bin/bash
set -e

echo -e "\n"
PGPASSWORD="$PARADEDB_PASSWORD"
echo "\l" | psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d postgres


SQL_DIR='default'
cd "$SQL_DIR"
. ./init.sh
cd -


psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d $PARADEDB_DB -c "\d+"
# psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d $PARADEDB_DB -c "\dt+ public.*"

