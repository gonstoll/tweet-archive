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
  userId: varchar('user_id', {length: 100}).notNull(),
})

export const tweetRelations = relations(tweet, ({many}) => ({
  tweetsToTags: many(tweetsToTags),
}))

export const tag = mysqlTable('tag', {
  id: serial('tag_id').primaryKey().notNull(),
  name: varchar('name', {length: 255}).notNull(),
  color: mysqlEnum('color', tagColors).notNull(),
  userId: varchar('user_id', {length: 100}).notNull(),
})

export const tagsRelations = relations(tag, ({many}) => ({
  tweetsToTags: many(tweetsToTags),
}))

export const tweetsToTags = mysqlTable(
  'tweet_tag',
  {
    tweetId: int('tweet_id').notNull(),
    tagId: int('tag_id').notNull(),
    userId: varchar('user_id', {length: 100}).notNull(),
  },
  table => ({
    primaryKey: primaryKey(table.tweetId, table.tagId, table.userId),
  })
)

export const tweetWithTagsRelations = relations(tweetsToTags, ({one}) => ({
  tweet: one(tweet, {
    fields: [tweetsToTags.tweetId],
    references: [tweet.id],
  }),
  tag: one(tag, {
    fields: [tweetsToTags.tagId],
    references: [tag.id],
  }),
}))
