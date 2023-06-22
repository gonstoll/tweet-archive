import {z} from 'zod'

const envVariables = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Drizzle
  DATABASE_HOST: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_URL: z.string(),

  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),

  // Upstash
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
})

// Just in case somewhere around the codebase we access process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

try {
  envVariables.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    const {fieldErrors} = error.flatten()
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(', ')}` : field
      )
      .join('\n  ')
    throw new Error(`Missing environment variables:\n  ${errorMessage}`)
  }
}

export const ENV = envVariables.parse(process.env)
