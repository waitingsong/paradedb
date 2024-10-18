import { initDbConnectionConfig } from 'paradedb'

import type { DbConfig, MiddlewareConfig, MiddlewareOptions } from './types.js'


export const initMiddlewareOptions: MiddlewareOptions = {
  debug: false,
}
export const initialMiddlewareConfig: Readonly<Omit<MiddlewareConfig, 'ignore' | 'match' | 'options'>> = {
  enableMiddleware: false,
}

// const initDbConnectionConfig =

export const initDbConfig: DbConfig = {
  client: 'pg',
  connection: {
    ...initDbConnectionConfig,
  },
  pool: {
    min: 0,
    max: 100,
    // propagateCreateError: false,
  },
  acquireConnectionTimeout: 30000,
}

