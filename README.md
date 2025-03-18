# interactive nextjs 15 list demo

This is a trimmed down version of an [app I built about helping people declutter](https://declutterspace.net).

[Blog post: Interactive Next.js list demo with useOptimistic](https://dev.to/hcsum/responsive-nextjs-list-demo-with-useoptimistic-2d58)

I am learning Next.js 15 and I wanted to build a simple demo to get familiar with the new features, such as `useOptimistic`, `useActionState`, server actions and explore new ways to manage state.

This demo combines Context API and the `useOptimistic` hook to make updating items feel more responsive. It also leverages Next.js's `revalidatePath` to keep the UI in sync with the server state in a more seamless way.

To run it locally:

```
git clone https://github.com/hcsum/interactive-nextjs-list-demo.git
cd interactive-nextjs-list-demo
npm install
```

Create a `.env` file and add the following:

If use sqlite:

```
DATABASE_URL="file:./dev.db"
```

If use postgres:

```
DATABASE_URL=<your-postgres-connection-string>
```

Modify `prisma/schema.prisma` to use the database you want to use.

Run db migrations:

```
npx prisma migrate dev
```

Start the server:

```
npm run dev
```
