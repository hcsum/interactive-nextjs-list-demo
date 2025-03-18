"use server";
import { createSession, verifySession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createDemoItems } from "./items";
import { createPresetCategories } from "./category";

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

  void deleteUsers10DaysOld();

  redirect("/");
}

export async function getUserBySession() {
  const { userId } = await verifySession();

  const result = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  });

  if (!result) {
    // (await cookies()).delete("session"); // won't work, nextjs complains: Cookies can only be modified in a Server Action or Route Handler.
    // so this is not a freaking server action, just a server function, wtf
    // heck: redirect to a path call /logout, and modify cookie there, then redirect to login page.
    redirect("/logout");
  }

  return result;
}

async function deleteUsers10DaysOld() {
  await prisma.user.deleteMany({
    where: {
      createdAt: {
        lt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    },
  });
}
