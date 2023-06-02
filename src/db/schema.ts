import {
  mysqlTable,
  serial,
  text,
  varchar,
  date,
  mysqlEnum,
  int,
  primaryKey,
} from 'drizzle-orm/mysql-core'
import {relations} from 'drizzle-orm'

export const tweets = mysqlTable('tweets', {
  id: varchar('tweet_id', {length: 30}).notNull(),
  description: text('description'),
  url: varchar('url', {length: 2083}).notNull(),
  createdAt: date('created_at').notNull(),
})

export const tweetsRelations = relations(tweets, ({many}) => ({
  tags: many(tags),
}))

export const tags = mysqlTable('tags', {
  id: serial('tag_id').primaryKey().notNull(),
  name: varchar('name', {length: 255}).notNull(),
  color: mysqlEnum('color', ['red', 'green', 'blue', 'yellow']).notNull(),
})

export const tagsRelations = relations(tags, ({many}) => ({
  tweets: many(tags),
}))

const tagsToTweets = mysqlTable(
  'tags_to_tweets',
  {
    tweetId: int('tweet_id')
      .notNull()
      .references(() => tweets.id),
    tagId: int('tag_id')
      .notNull()
      .references(() => tags.id),
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
