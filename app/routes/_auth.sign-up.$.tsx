import {SignUp} from '@clerk/remix'

export default function SignUpPage() {
  return (
    <div>
      <SignUp
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
