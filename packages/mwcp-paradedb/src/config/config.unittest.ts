import { initDbConfig } from '##/lib/config.js'
import type { Config } from '##/lib/types.js'


export const keys = Date.now().toString()
export const koa = {
  port: 7001,
}

export const paradedbConfig: Config = {
  enableDefaultRoute: true,
  enableApi: true,
  dataSource: {
    default: {
      ...initDbConfig,
    },
  },
  defaultDataSourceName: 'default',
}
/* c8 ignore next 4 */
if (paradedbConfig.dataSource['default']?.connection && ! paradedbConfig.dataSource['default'].connection.password) {
  // docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 quay.io/tembo/pgmq-pg:latest
  paradedbConfig.dataSource['default'].connection.password = 'postgres'
}
