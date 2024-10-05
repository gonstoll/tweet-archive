import {SignIn} from '@clerk/remix'

export default function SignInPage() {
  return (
    <div>
      <SignIn
        appearance={{
          elements: {
            card: 'shadow-lg border bg-background',
            headerTitle: 'text-foreground',
            headerSubtitle: 'text-muted-foreground',
            footerActionText: 'text-foreground',
            footerActionLink: 'text-primary underline',
          },
        }}
      />
    </div>
  )
}
