import * as schema from './schema'
import {drizzle} from 'drizzle-orm/planetscale-serverless'
import {connect} from '@planetscale/database'
import {ENV} from '~/env'

// create the connection
const connection = connect({
  host: ENV.DATABASE_HOST,
  username: ENV.DATABASE_USERNAME,
  password: ENV.DATABASE_PASSWORD,
})

export const db = drizzle(connection, {schema})