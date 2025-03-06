"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { Item, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ERROR_FREE_TRAIL_ITEM_LIMIT,
  FREE_TRAIL_ITEMS_LIMIT,
} from "@/lib/definitions";

export type ItemCreateInput = {
  name: string;
  pieces: number;
  deadline: number; // represented in months
  categoryId?: string;
};

export type ItemUpdateInput = {
  name?: string;
  pieces?: number;
  deadline?: Date;
  categoryId?: string | null;
};

const CreateItemFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  pieces: z.coerce.number().min(1, { message: "Must be at least 1 piece." }),
  deadline: z.coerce.number().min(1, { message: "Invalid deadline." }),
  categoryId: z.string().optional(),
});

const UpdateItemFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim()
    .optional(),
  pieces: z.coerce
    .number()
    .min(1, { message: "Must be at least 1 piece." })
    .optional(),
  deadline: z.coerce.date().optional(),
  categoryId: z.string().optional(),
});

export type ItemFormState =
  | {
      errors?: {
        name?: string[];
        pieces?: string[];
        deadline?: string[];
        categoryId?: string[];
        freeTrailLimitReached?: boolean;
      };
      item?: Item;
    }
  | undefined;

export async function getItems(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
  archived?: boolean,
) {
  const { userId } = await verifySession();

  const whereClause = {
    userId,
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(category
      ? {
          category: {
            id: category,
          },
        }
      : {}),
    ...(archived ? { archivedAt: { not: null } } : { archivedAt: null }),
  };

  const total = await prisma.item.count({
    where: whereClause,
  });

  const items = await prisma.item.findMany({
    where: whereClause,
    orderBy: [{ updatedAt: "desc" }, { deadline: "asc" }],
    include: { category: true },
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function createItem(
  formData: FormData,
): Promise<ItemFormState | undefined> {
  const { userId } = await verifySession();

  try {
    await verifyFreeTrialLimit();
  } catch {
    return {
      errors: {
        freeTrailLimitReached: true,
      },
    };
  }

  const validationResult = CreateItemFormSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, pieces, deadline, categoryId } = validationResult.data;

  const deadlineInDate = new Date(
    new Date().setMonth(new Date().getMonth() + deadline),
  );

  const item = await prisma.item.create({
    data: {
      name,
      pieces,
      deadline: deadlineInDate,
      startDate: new Date(),
      user: { connect: { id: userId } },
      category: categoryId ? { connect: { id: categoryId } } : undefined,
    },
  });

  revalidatePath("/");

  return {
    item,
  };
}

export async function createManyItems(
  items: ItemCreateInput[],
): Promise<{ error?: string } | undefined> {
  const { userId } = await verifySession();

  try {
    await verifyFreeTrialLimit();
  } catch {
    return {
      error: ERROR_FREE_TRAIL_ITEM_LIMIT,
    };
  }

  const validationResult = z.array(CreateItemFormSchema).safeParse(items);

  if (!validationResult.success) {
    return {
      error: "invalid items",
    };
  }

  await prisma.item.createMany({
    data: validationResult.data.map((item) => ({
      ...item,
      userId: userId,
      startDate: new Date(),
      deadline: new Date(
        new Date().setMonth(new Date().getMonth() + item.deadline),
      ),
    })),
  });
  revalidatePath("/");
}

export async function deleteItem(id: string) {
  const { userId } = await verifySession();
  await prisma.item.delete({
    where: { id, userId: userId },
  });
  revalidatePath("/");
}

export async function updateItem(id: string, data: Partial<ItemUpdateInput>) {
  const { userId } = await verifySession();

  const validationResult = UpdateItemFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const item = await prisma.item.findUniqueOrThrow({
    where: {
      id,
      userId,
    },
  });

  const updateData: Prisma.ItemUpdateInput = {};
  if (data.name !== null) updateData.name = data.name;
  if (data.pieces !== null) updateData.pieces = data.pieces;
  if (data.deadline !== null) updateData.deadline = data.deadline;
  if (data.categoryId !== null) {
    updateData.category = data.categoryId
      ? { connect: { id: data.categoryId } }
      : { disconnect: true };
  }

  if (updateData.deadline && updateData.deadline !== item.deadline) {
    updateData.startDate = new Date();
  }

  await prisma.item.update({
    where: {
      id,
      userId,
    },
    data: updateData,
  });

  revalidatePath("/");
}

export async function archiveItem(id: string) {
  await prisma.item.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
}

async function verifyFreeTrialLimit() {
  const { total } = await getItems();

  if (total >= FREE_TRAIL_ITEMS_LIMIT) {
    throw ERROR_FREE_TRAIL_ITEM_LIMIT;
  }
}

export async function createDemoItems(userId: string) {
  await prisma.item.createMany({
    data: [
      {
        userId,
        name: "That one thing",
        pieces: 1,
        startDate: new Date(),
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      },
      {
        userId,
        name: "That other thing",
        pieces: 1,
        startDate: new Date(),
        deadline: new Date(new Date().setDate(new Date().getDate() + 6)),
      },
      {
        userId,
        name: "That one thing that I never used",
        pieces: 1,
        startDate: new Date(),
        deadline: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    ],
  });
}
