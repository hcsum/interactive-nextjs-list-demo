"use server";
import { createSession } from "@/lib/session";
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

export async function deleteUsers10DaysOld() {
  await prisma.user.deleteMany({
    where: {
      createdAt: {
        lt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    },
  });
}
