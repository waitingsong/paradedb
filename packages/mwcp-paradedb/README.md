# Midway.js [ParadeDB] Component

[![GitHub tag](https://img.shields.io/github/tag/waitingsong/paradedb.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/badge/lang-TypeScript-blue.svg)]()
[![ci](https://github.com/waitingsong/paradedb/actions/workflows/nodejs.yml/badge.svg
)](https://github.com/waitingsong/paradedb/actions)
[![codecov](https://codecov.io/gh/waitingsong/paradedb/graph/badge.svg?token=oDHz5mmy7x)](https://codecov.io/gh/waitingsong/paradedb)

[ParadeDB] is an Elasticsearch alternative built on Postgres.
We're modernizing the features of Elasticsearch's product suite, 
starting with real-time search and analytics.

Test successfully with
- [Paradedb] v0.11
- [Paradedb] v0.12
- [Paradedb] v0.13
- [Paradedb] v0.14


## Packages

| Package          | Version                |
| ---------------- | ---------------------- |
| [paradedb-js]    | [![main-svg]][main-ch] |
| [@mwcp/paradedb] | [![cli-svg]][cli-ch]   |


## Installation

```sh
npm i paradedb 
// OR
npm i @mwcp/paradedb
```

## Usage

### Index

- Initialize ParadeDb instance
  ```ts
  import { ParadeDb, type DbConnectionConfig } from 'paradedb'

  const connection: DbConnectionConfig  = {
    host: process.env['PARADEDB_HOST'] ? process.env['PARADEDB_HOST'] : 'localhost',
    port: process.env['PARADEDB_PORT'] ? +process.env['PARADEDB_PORT'] : 5432,
    database: process.env['PARADEDB_DB'] ? process.env['PARADEDB_DB'] : 'postgres',
    user: process.env['PARADEDB_USER'] ? process.env['PARADEDB_USER'] : 'postgres',
    password: process.env['PARADEDB_PASSWORD'] ? process.env['PARADEDB_PASSWORD'] : 'password',
  }

  const pdb = new ParadeDb('master', { connection })
  ```

- [Create an Index]
  ```ts
  const options: CreateBm25Options = {
    indexName: 'search_idx',
    tableName: 'mock_items',
    keyField: 'id',
  }
  await pdb.index.createBm25(options)
  ```
  [More examples](https://github.com/waitingsong/paradedb/tree/main/packages/paradedb/test/lib/index-manager)

- [Drop an Index]
  ```ts
  const options: DropBm25Options = {
    indexName: 'search_idx',
  }
  await pdb.index.dropBm25(options)
  ```

- [Index Schema]
  ```ts
  const rows: IndexSchemaDto[] = await idx.schema({ indexName: 'search_idx' })
  assert(rows.length, 'Not found')
  ```

- [Index Size]
  ```ts
  const size: bigint = await idx.size({ indexName: 'search_idx' })
  // 0n means not found
  ```

### Full Text Search

- [Syntax of knex query builder]
- [FTS Examples]

Basic Usage:
```ts
const pdb = new ParadeDb('test', dbConfig)
const rows = await pdb.search<MockItemsDo>('mock_items')
  .whereRaw(`description @@@ :k1`, { k1: 'keyboard' })
  .orderBy('id', 'desc')
  .limit(limit)
```

## Midway.js Component

### Configuration

Update project `src/configuration.ts`
```ts
import { Configuration } from '@midwayjs/core'
import * as pdb from '@mwcp/paradedb'

@Configuration({
  imports: [ pdb ],
  importConfigs: [join(__dirname, 'config')],
})
export class ContainerConfiguration implements ILifeCycle {
}
```

## Usage

[Example](https://github.com/waitingsong/paradedb/blob/main/packages/mwcp-paradedb/test/fixtures/base-app/src/paradedb-manager.ts#L29)



## License
[MIT](LICENSE)


### Languages
- [English](README.md)
- [中文](README.zh-CN.md)

<br>

[paradedb-js]: https://github.com/waitingsong/paradedb/tree/main/packages/paradedb
[main-svg]: https://img.shields.io/npm/v/paradedb.svg?maxAge=300
[main-ch]: https://github.com/waitingsong/paradedb/tree/main/packages/paradedb/CHANGELOG.md


[@mwcp/paradedb]: https://github.com/waitingsong/paradedb/tree/main/packages/mwcp-paradedb
[cli-svg]: https://img.shields.io/npm/v/@mwcp/paradedb.svg?maxAge=300
[cli-ch]: https://github.com/waitingsong/paradedb/tree/main/packages/mwcp-paradedb/CHANGELOG.md


[Midway.js]: https://midwayjs.org/
[ParadeDB]: https://www.paradedb.com/

[Create an Index]: https://docs.paradedb.com/documentation/indexing/create_index
[Drop an Index]: https://docs.paradedb.com/documentation/indexing/delete_index
[Index Schema]: https://docs.paradedb.com/documentation/indexing/inspect_index#index-schema
[Index Size]: https://docs.paradedb.com/documentation/indexing/inspect_index#index-size

[Syntax of knex query builder]: https://knexjs.org/guide/query-builder.html
[FTS Examples]: https://github.com/waitingsong/paradedb/tree/main/packages/paradedb/test/lib/fts
