import assert from 'node:assert'

import {
  App,
  ApplicationContext,
  DataSourceManager,
  IMidwayContainer,
  Init,
  Inject,
  Logger as _Logger,
  Singleton,
} from '@midwayjs/core'
import { ILogger } from '@midwayjs/logger'
import { Application, MConfig } from '@mwcp/share'
import { ParadeDb } from 'paradedb'

import { ConfigKey, DbConfig, ParadeDbSourceConfig } from './types.js'


@Singleton()
export class ParadeDbManager extends DataSourceManager<ParadeDb> {

  @MConfig(ConfigKey.config) private readonly sourceConfig: ParadeDbSourceConfig

  @App() readonly app: Application
  @ApplicationContext() readonly applicationContext: IMidwayContainer

  @_Logger() private readonly logger: ILogger

  @Inject() readonly baseDir: string

  getName(): string {
    return 'paradeDbManager'
  }

  @Init()
  async init(): Promise<void> {
    await this.initDataSource(this.sourceConfig, '')
  }

  // #region checkConnected

  async checkConnected(dataSource: ParadeDb): Promise<boolean> {
    try {
      const time = await dataSource.getCurrentTime()
      return !! time
    }
    /* c8 ignore next 4 */
    catch (ex) {
      this.logger.error('[KmoreDbSourceManager]: checkConnected(). error ignored', ex)
      return false
    }
  }

  // #region createDataSource

  /**
   * 创建单个实例
   */
  protected async createDataSource(
    config: DbConfig,
    dataSourceName: string,
  ): Promise<ParadeDb | undefined> {

    const dbConfig = this.getDbConfigByDbId(dataSourceName)
    assert(dbConfig, `createDataSource() failed: ${dataSourceName}`)
    const inst = new ParadeDb(dataSourceName, dbConfig)
    assert(inst, `createDataSource() failed: ${dataSourceName}`)

    const connected = await this.checkConnected(inst)
    const conn: DbConfig['connection'] = { ...dbConfig.connection, password: '***' }
    assert(connected, `checkConnected() failed: ${dataSourceName}` + JSON.stringify(conn))

    // await inst.setTimeZone('Asia/Chongqing') // or 'UTC'

    this.setDbConfigByDbId(dataSourceName, config)
    return inst
  }

  // #region destroyDataSource

  override async destroyDataSource(dataSource: ParadeDb): Promise<void> {
    if (await this.checkConnected(dataSource)) {
      try {
        await dataSource.destroy()
      }
      /* c8 ignore next 4 */
      catch (ex: unknown) {
        this.logger.error(`Destroy knex connection failed with identifier: "${dataSource.dbId}" :
          \n${(ex as Error).message}`)
      }
    }
    this.dataSource.delete(dataSource.dbId)
  }


  protected getDbConfigByDbId(dbId: string): DbConfig | undefined {
    assert(dbId)
    const dbConfig = this.sourceConfig.dataSource[dbId]
    return dbConfig
  }

  protected setDbConfigByDbId(dbId: string, dbConfig: DbConfig): void {
    assert(dbId)
    assert(dbConfig)
    // if (! this.sourceConfig.dataSource) {
    //   this.sourceConfig.dataSource = {}
    // }
    this.sourceConfig.dataSource[dbId] = dbConfig
  }

}

