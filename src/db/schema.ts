import {relations} from 'drizzle-orm'
import {integer, primaryKey, sqliteTable, text} from 'drizzle-orm/sqlite-core'

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

export const tweet = sqliteTable('tweet', {
  id: integer('id', {mode: 'number'})
    .primaryKey({autoIncrement: true})
    .notNull(),
  description: text('description'),
  url: text('url', {length: 2083}).notNull(),
  createdAt: integer('created_at', {mode: 'timestamp'}).notNull(),
  userId: text('user_id', {length: 100}).notNull(),
})

export const tweetRelations = relations(tweet, ({many}) => ({
  tweetsToTags: many(tweetsToTags),
}))

export const tag = sqliteTable('tag', {
  id: integer('id', {mode: 'number'})
    .primaryKey({autoIncrement: true})
    .notNull(),
  name: text('name', {length: 255}).notNull(),
  color: text('color', {enum: tagColors}).notNull(),
  userId: text('user_id', {length: 100}).notNull(),
})

export const tagsRelations = relations(tag, ({many}) => ({
  tweetsToTags: many(tweetsToTags),
}))

export const tweetsToTags = sqliteTable('tweet_tag', {
  tweetId: integer('tweet_id', {mode: 'number'})
    .notNull()
    .references(() => tweet.id),
  tagId: integer('tag_id', {mode: 'number'})
    .notNull()
    .references(() => tag.id),
})

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
