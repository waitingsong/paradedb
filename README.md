# [ParadeDb] JavaScript Client Library

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


## Packages

| Package    | Version                |
| ---------- | ---------------------- |
| [paradedb] | [![main-svg]][main-ch] |


## Installation

```sh
npm i paradedb 
```

## Usage

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


## License
[MIT](LICENSE)


### Languages
- [English](README.md)
- [中文](README.zh-CN.md)

<br>

[paradedb]: https://github.com/waitingsong/paradedb/tree/main/packages/paradedb
[main-svg]: https://img.shields.io/npm/v/paradedb.svg?maxAge=300
[main-ch]: https://github.com/waitingsong/paradedb/tree/main/packages/paradedb/CHANGELOG.md


[`demo-cli`]: https://github.com/waitingsong/kmore/tree/main/packages/kmore-cli
[cli-svg]: https://img.shields.io/npm/v/kmore-cli.svg?maxAge=300
[cli-ch]: https://github.com/waitingsong/kmore/tree/main/packages/kmore-clie/CHANGELOG.md


[Midway.js]: https://midwayjs.org/
[ParadeDB]: https://www.paradedb.com/

[Create an Index]: https://docs.paradedb.com/documentation/indexing/create_index
[Drop an Index]: https://docs.paradedb.com/documentation/indexing/delete_index
[Index Schema]: https://docs.paradedb.com/documentation/indexing/inspect_index#index-schema

