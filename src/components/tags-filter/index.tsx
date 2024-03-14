import {createTag, deleteTag, getTags, type Tag} from '~/db/models/tag'
import {TagsFilterComponent} from './tags-filter-component'

export async function TagsFilter({
  type,
  initialTags,
}: {
  type: 'filter' | 'select'
  initialTags?: Array<Tag>
}) {
  const tags = await getTags()

  return (
    <TagsFilterComponent
      type={type}
      tags={tags}
      initialTags={initialTags}
      createTag={createTag}
      deleteTag={deleteTag}
    />
  )
}
