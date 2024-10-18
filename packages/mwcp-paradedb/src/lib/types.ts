// import type { DataSourceManagerConfigOption } from '@midwayjs/core'
import type { BaseConfig } from '@mwcp/share'
import type { MiddlewareConfig as MWConfig } from '@waiting/shared-types'
import type { DbConfig } from 'paradedb'


export type { DbConnectionConfig } from 'paradedb'
export type { DbConfig }

export enum ConfigKey {
  config = 'paradedbConfig',
  middlewareConfig = 'paradedbMiddlewareConfig',
  namespace = 'paradedb',
  componentName = 'paradedbComponent',
  middlewareName = 'paradedbMiddleware',
}

export enum Msg {
  hello = 'hello world',
}

export interface Config extends BaseConfig, ParadeDbSourceConfig {
  /**
   * Enable mq http route, eg. /pgmq/queue/create
   */
  enableApi?: boolean | undefined
}

export interface MiddlewareOptions {
  debug: boolean
}
export type MiddlewareConfig = MWConfig<MiddlewareOptions>


/** midway DataSource */
export interface ParadeDbSourceConfig {
  defaultDataSourceName?: string
  dataSource: Record<string, DbConfig>
  /**
   * @default false
   */
  validateConnection?: boolean
  /**
   * @default true
   */
  cacheInstance?: boolean | undefined
}

