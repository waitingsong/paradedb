import type { Knex } from '../knex.types.js'

import { IndexManager011 } from './index-manager-011.js'


export class IndexManager012 extends IndexManager011 {

  constructor(override readonly dbh: Knex) {
    super(dbh)
    this.indexSuffix = ''
  }

}


