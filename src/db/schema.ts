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

export const tweets = mysqlTable('tweets', {
  id: serial('id').primaryKey().notNull(),
  tweetId: varchar('tweet_id', {length: 30}).notNull(),
  description: text('description'),
  url: varchar('url', {length: 2083}).notNull(),
  createdAt: date('created_at').notNull(),
})

export const tweetsRelations = relations(tweets, ({many}) => ({
  tags: many(tagsToTweets),
}))

export const tags = mysqlTable('tags', {
  id: serial('tag_id').primaryKey().notNull(),
  name: varchar('name', {length: 255}).notNull(),
  color: mysqlEnum('color', ['red', 'green', 'blue', 'yellow']).notNull(),
})

export const tagsRelations = relations(tags, ({many}) => ({
  tweets: many(tagsToTweets),
}))

export const tagsToTweets = mysqlTable(
  'tags_to_tweets',
  {
    tweetId: int('tweet_id').notNull(),
    tagId: int('tag_id').notNull(),
  },
  table => ({
    primaryKey: primaryKey(table.tweetId, table.tagId),
  })
)

export const tagsToTweetsRelations = relations(tagsToTweets, ({one}) => ({
  tweet: one(tweets, {
    fields: [tagsToTweets.tweetId],
    references: [tweets.id],
  }),
  tag: one(tags, {
    fields: [tagsToTweets.tagId],
    references: [tags.id],
  }),
}))
