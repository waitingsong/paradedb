import assert from 'node:assert'

import {
  App,
  Configuration,
  Inject,
  Logger,
  MidwayEnvironmentService,
  MidwayInformationService,
  MidwayWebRouterService,
} from '@midwayjs/core'
import type { ILifeCycle, ILogger } from '@midwayjs/core'
import { TraceInit } from '@mwcp/otel'
import {
  MConfig,
  deleteRouter,
} from '@mwcp/share'
import type { Application, IMidwayContainer } from '@mwcp/share'

import * as DefaultConfig from './config/config.default.js'
import * as LocalConfig from './config/config.local.js'
import * as UnittestConfig from './config/config.unittest.js'
import { useComponents } from './imports.js'
import { ParadeDbManager } from './lib/paradedb-manager.js'
import { ConfigKey } from './lib/types.js'
import type { Config, MiddlewareConfig } from './lib/types.js'


@Configuration({
  namespace: ConfigKey.namespace,
  importConfigs: [
    {
      default: DefaultConfig,
      local: LocalConfig,
      unittest: UnittestConfig,
    },
  ],
  imports: useComponents,
})
export class AutoConfiguration implements ILifeCycle {

  @App() readonly app: Application

  @Inject() protected readonly environmentService: MidwayEnvironmentService
  @Inject() protected readonly informationService: MidwayInformationService
  @Inject() protected readonly webRouterService: MidwayWebRouterService

  @Logger() protected readonly logger: ILogger

  @MConfig(ConfigKey.config) protected readonly config: Config
  @MConfig(ConfigKey.middlewareConfig) protected readonly mwConfig: MiddlewareConfig

  @Inject() protected readonly dbSourceManager: ParadeDbManager

  async onConfigLoad(): Promise<void> {
    /* c8 ignore next 3 */
    if (! this.config.enableDefaultRoute) {
      await deleteRouter(`/_${ConfigKey.namespace}`, this.webRouterService)
    }
    else if (this.mwConfig.ignore) {
      this.mwConfig.ignore.push(new RegExp(`/_${ConfigKey.namespace}/.+`, 'u'))
    }
  }

  @TraceInit({ namespace: ConfigKey.namespace })
  async onReady(container: IMidwayContainer): Promise<void> {
    void container
    assert(
      this.app,
      'this.app undefined. If start for development, please set env first like `export MIDWAY_SERVER_ENV=local`',
    )
  }

  async onStop(container: IMidwayContainer): Promise<void> {
    void container
    this.logger.info(`[${ConfigKey.componentName}] stopping`)
    await this.dbSourceManager.stop()
    this.logger.info(`[${ConfigKey.componentName}] stopped`)
  }

}

