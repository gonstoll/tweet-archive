import {parseWithZod} from '@conform-to/zod'
import {json, type ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {deleteTweet} from '~/db/models/tweets'

export const schema = z.object({
  id: z.coerce.number(),
})

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
    await deleteTweet(args, result.value.id)
    console.log('logging Deleted tweet!!!!: ', result.value.id)
    return {}
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
