# Tweet Archive

Do you ever find yourself in Twitter (excuse me, X) scrolling through your bookmarks/retweets/likes and not being able
to find the tweet you're looking for?

Then this app is for you :)

Tweet Archive is an app where you can store relevant tweets for later reference. You can tag them, search through them
and edit them at any point in time, at your leisure.

<img src="__images/screenshot1.png" alt="Tweet archive screeenshot" />
<img src="__images/screenshot2.png" alt="Tweet archive screeenshot with tags applied" />
<img src="__images/screenshot3.png" alt="Tweet archive screeenshot with tags and search applied" />

## Features

- Add tweets to your archive
- Tag tweets
- Search through your archive
- Edit tweets
- Delete tweets

## Tech Stack and infrastructure

- Next.js
- Tailwind CSS
- Drizzle ORM
- Zod
- Bun
- Vercel
- Planetscale
- Clerk
- Upstash

## How to run the app

This project uses Planetscale for the database, Clerk for authentication and Upstash for ratelimiting. So, you will need
to create an account on these platforms and set up the necessary environment variables. You can find the necessary
environment variables in the `.env.example` file. Copy the contents of the file to a new file called `.env.local` and
fill in the necessary values. The app will not work at all without them.

Once you have the environment variables set up, you need to install its dependencies:

```bash
bun install
```

Next thing, you'll need to run the db migrations and push the schema to Planetscale:

```bash
bun run db:migrate && bun run db:push
```

If you wanna have some data off the bat, you can run the seed command:

```bash
npx ts-node ./src/db/seed.ts
```

Then you can run the app:

```bash
bun run dev
```
