import {connect} from '@planetscale/database'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {ENV} from '~/env.js'
import * as schema from './schema.js'

const connection = connect({
  host: ENV.DATABASE_HOST,
  username: ENV.DATABASE_USERNAME,
  password: ENV.DATABASE_PASSWORD,
})

export const db = drizzle(connection, {schema})
