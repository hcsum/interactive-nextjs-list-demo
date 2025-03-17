"use client";

import { ItemUpdateInput } from "@/actions/items";
import { Item } from "@prisma/client";
import { createContext, useOptimistic, useTransition } from "react";

export type EditingItem = ItemUpdateInput & {
  id: string;
};

export type OptimisticItem = Item & { updating?: boolean };

export type ItemReducerAction =
  | { type: "update"; item: EditingItem }
  | { type: "delete"; itemId: string }
  | { type: "add"; item: Item };

export const itemReducer = (
  state: OptimisticItem[],
  action: ItemReducerAction,
) => {
  switch (action.type) {
    case "update":
      return state.map((item) =>
        item.id === action.item.id
          ? { ...item, ...action.item, updating: true }
          : item,
      );
    case "delete":
      return state.filter((item) => item.id !== action.itemId);
    case "add":
      return [action.item, ...state];
    default:
      return state;
  }
};

export const OptimisticItemsContext = createContext<{
  items: OptimisticItem[];
  updateOptimisticItems: (action: ItemReducerAction) => void;
} | null>(null);

export const ItemsProvider = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: Item[];
}) => {
  const [optimisticItems, updateItems] = useOptimistic<
    OptimisticItem[],
    ItemReducerAction
  >(items, itemReducer);
  const [, startTransition] = useTransition();

  const updateOptimisticItems = (action: ItemReducerAction) => {
    startTransition(() => {
      updateItems(action);
    });
  };

  console.log("optimisticItems", optimisticItems);

  return (
    <OptimisticItemsContext.Provider
      value={{
        items: optimisticItems,
        updateOptimisticItems,
      }}
    >
      {children}
    </OptimisticItemsContext.Provider>
  );
};
