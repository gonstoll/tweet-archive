'use client'

import {TagsFilter} from '~/components/tags-filter'
import {Tag} from '~/db/db'

export function TweetForm({tags}: {tags: Array<Tag>}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('logging event', event)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tweet URL
        <input type="url" name="tweet-url" id="tweet-url" required />
      </label>
      <label>
        Description (optional)
        <input type="text" name="tweet-description" id="tweet-description" />
      </label>
      <TagsFilter tags={tags} isFilter={false} />
      <button type="submit">Submit!</button>
    </form>
  )
}
