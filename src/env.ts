import {z} from 'zod'

const envVariables = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

export const ENV = envVariables.parse(process.env)

// Just in case somewhere around the codebase we access process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

try {
  envVariables.parse(process.env)
} catch (err) {
  if (err instanceof z.ZodError) {
    const {fieldErrors} = err.flatten()
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(', ')}` : field
      )
      .join('\n  ')
    throw new Error(`Missing environment variables:\n  ${errorMessage}`)
  }
}
