import type { Config, ConfigKey, MiddlewareConfig } from './lib/types.js'


export { AutoConfiguration as Configuration } from './configuration.js'
export * from './app/index.app.js'
export type * from './interface.js'
export * from './lib/index.js'

// export { QueueApi } from './app/index.app.js'

export type {
  ArrayFieldsDo,
  BooleanFieldsDo,
  CreateBm25Options,
  DatetimeFieldsDo,
  DbConnectionConfig,
  DropBm25Options,
  IndexSchemaDo,
  IndexSchemaDto,
  IndexSchemaOptions,
  IndexSizeDo,
  IndexSizeOptions,
  JsonFieldsDo,
  NormalizerType,
  ParadeDb,
  RecordType,
  TextFieldsDo,
} from 'paradedb'

declare module '@midwayjs/core/dist/interface.js' {
  interface MidwayConfig {
    [ConfigKey.config]: Partial<Config>
    [ConfigKey.middlewareConfig]: Partial<MiddlewareConfig>
  }
}

