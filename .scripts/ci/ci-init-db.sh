#!/bin/bash
set -e

psql -V
# netstat -tunpl
# dig postgres

psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "SELECT version();"
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "SHOW TIMEZONE;"
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U$POSTGRES_USER -d $POSTGRES_DB -c "SELECT extname, extversion FROM pg_extension;"

echo -e "\n"

# SQL_DIR='./packages/demo/database/'

# cd "$SQL_DIR"
# pwd
# . ./init-db.sh
# cd -


psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d $PARADEDB_DB -c "SELECT version();"
psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d $PARADEDB_DB -c "SHOW TIMEZONE;"
psql -h $PARADEDB_HOST -p $PARADEDB_PORT -U$PARADEDB_USER -d $PARADEDB_DB -c "SELECT extname, extversion FROM pg_extension;"
SQL_DIR='./packages/paradedb/database/'

cd "$SQL_DIR"
pwd
. ./init-db.sh
cd -
