import {getAuth} from '@clerk/remix/ssr.server'
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import {getZodConstraint, parseWithZod} from '@conform-to/zod'
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from '@remix-run/react'
import {AlertCircle, Loader2} from 'lucide-react'
import {useSpinDelay} from 'spin-delay'
import {z} from 'zod'
import {ErrorList} from '~/components/error-list'
import {TagsFilter} from '~/components/tags-filter'
import {Alert, AlertDescription, AlertTitle} from '~/components/ui/alert'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {Label} from '~/components/ui/label'
import {Textarea} from '~/components/ui/textarea'
import {getTags} from '~/db/models/tags'
import {editTweet, getTweet} from '~/db/models/tweets'

export const schema = z.object({
  id: z.coerce.number(),
  url: z
    .string({required_error: 'Tweet URL is required'})
    .url({message: 'Invalid URL'})
    .trim()
    .min(1, {message: 'Tweet URL is required'})
    .max(200, {
      message: 'Link should have at most 200 (two hundred) characters',
    }),
  description: z
    .string()
    .max(600, {
      message: 'Description should have at most 600 (six hundred) characters',
    })
    .optional()
    .transform(v => v ?? null),
  tagIds: z
    .string()
    .optional()
    .transform(value => {
      if (!value) return undefined
      return value.split(',').map(tag => tag.trim())
    }),
})

export async function loader(args: LoaderFunctionArgs) {
  const {userId} = await getAuth(args)
  const id = args.params.id

  if (!userId) {
    return redirect('/sign-in')
  }

  const tags = await getTags(userId)
  const tweet = await getTweet(Number(id || ''))
  return {tags, tweet}
}

export async function action(args: ActionFunctionArgs) {
  const {request} = args
  const formData = await request.formData()
  const result = parseWithZod(formData, {schema})

  if (result.status !== 'success') {
    return json(
      {
        status: 'error' as const,
        result: result.reply(),
      } as const,
      {status: result.status === 'error' ? 400 : 200},
    )
  }

  try {
    await editTweet(args, result.value)
    return redirect('/')
  } catch (error) {
    console.error(error)
    return json(
      {
        status: 'error' as const,
        result: result.reply({formErrors: ['Something went wrong']}),
      } as const,
      {status: 500},
    )
  }
}

export default function EditTweetPage() {
  const params = useParams<{id: string}>()
  const {tags, tweet} = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submitting =
    navigation.state === 'submitting' || navigation.state === 'loading'
  const showSpinner = useSpinDelay(submitting, {minDuration: 400})
  const [form, fields] = useForm({
    id: 'new-tweet',
    constraint: getZodConstraint(schema),
    lastResult: actionData?.result,
    onValidate({formData}) {
      return parseWithZod(formData, {schema})
    },
    defaultValue: {
      url: tweet.url,
      description: tweet.description,
    },
  })

  return (
    <Form method="POST" {...getFormProps(form)}>
      {form.errors?.length ? (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <ErrorList id={form.errorId} errors={form.errors} />
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

      <input type="hidden" name="id" value={params.id} />

      <TagsFilter form tags={tags} initialTags={tweet.tags} />

      <div className="mb-4 mt-4">
        <Label htmlFor={fields.url.id}>Tweet URL</Label>
        <Input {...getInputProps(fields.url, {type: 'url'})} />
        <ErrorList id={fields.url.id} errors={fields.url.errors} />
      </div>
      <div className="mb-4">
        <Label htmlFor={fields.description.id}>Description</Label>
        <Textarea {...getTextareaProps(fields.description)} />
        <ErrorList
          id={fields.description.id}
          errors={fields.description.errors}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="destructive">
          <Link to="/">Cancel</Link>
        </Button>
        <Button type="submit" variant="default" disabled={submitting}>
          {showSpinner ? <Loader2 className="mr-2 animate-spin" /> : null}
          Save
        </Button>
      </div>
    </Form>
  )
}
