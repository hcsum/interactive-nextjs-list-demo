# interactive nextjs 15 list demo

This is a trimmed down version of an [app I built about helping people declutter](https://declutterspace.net).

I am learning Next.js 15 and I wanted to build a simple demo to get familiar with the new features, such as `useOptimistic`, `useActionState`, server actions and explore new ways to manage state.

This demo combines Context API and the `useOptimistic` hook to make updating items feel more responsive. It also leverages Next.js's `revalidatePath` to keep the UI in sync with the server state in a more seamless way.
