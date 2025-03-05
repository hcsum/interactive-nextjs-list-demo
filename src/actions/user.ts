"use server";
import { createSession, verifySession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createPresetCategories } from "./category";
import { redirect } from "next/navigation";
import { createDemoItems } from "./items";

export async function createTempUser() {
  const user = await prisma.user.create({
    data: {},
  });

  await Promise.all([
    createPresetCategories(user.id),
    createDemoItems(user.id),
  ]).catch((err) => {
    console.error("Error creating demo items", err);
  });

  await createSession(user.id);
  redirect("/");
}

export async function getUserInfo<T extends Prisma.UserSelect>(
  select?: T,
): Promise<Prisma.UserGetPayload<{ select: T }> | null> {
  const { userId } = await verifySession();

  const result = (await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
    select: {
      id: true,
      ...select,
    },
  })) as Prisma.UserGetPayload<{ select: T }> | null;

  if (!result) {
    // (await cookies()).delete("session"); // won't work, nextjs complains: Cookies can only be modified in a Server Action or Route Handler.
    // so this is not a freaking server action, just a server function, wtf
    // heck: redirect to a path call /logout, and modify cookie there, then redirect to login page.
    redirect("/logout");
  }

  return result;
}
