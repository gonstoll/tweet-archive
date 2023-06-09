import {relations} from 'drizzle-orm'
import {
  date,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core'

export const tagColors = [
  'red',
  'green',
  'blue',
  'yellow',
  'gray',
  'brown',
  'orange',
  'purple',
  'pink',
] as const

export const tweet = mysqlTable('tweet', {
  id: serial('id').primaryKey().notNull(),
  tweetId: varchar('tweet_id', {length: 30}).notNull(),
  description: text('description'),
  url: varchar('url', {length: 2083}).notNull(),
  createdAt: date('created_at').notNull(),
})

export const tweetsRelations = relations(tweet, ({many}) => ({
  tags: many(tweetWithTag),
}))

export const tag = mysqlTable('tag', {
  id: serial('tag_id').primaryKey().notNull(),
  name: varchar('name', {length: 255}).notNull(),
  color: mysqlEnum('color', tagColors).notNull(),
})

export const tagsRelations = relations(tag, ({many}) => ({
  tweets: many(tweetWithTag),
}))

export const tweetWithTag = mysqlTable(
  'tweetWithTag',
  {
    tweetId: int('tweet_id').notNull(),
    tagId: int('tag_id').notNull(),
  },
  table => ({
    primaryKey: primaryKey(table.tweetId, table.tagId),
  })
)

export const tweetWithTagsRelations = relations(tweetWithTag, ({one}) => ({
  tweet: one(tweet, {
    fields: [tweetWithTag.tweetId],
    references: [tweet.id],
  }),
  tag: one(tag, {
    fields: [tweetWithTag.tagId],
    references: [tag.id],
  }),
}))
