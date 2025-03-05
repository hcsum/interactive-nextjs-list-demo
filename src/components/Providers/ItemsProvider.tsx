"use client";

import { ItemUpdateInput } from "@/actions/items";
import { Item } from "@prisma/client";
import { createContext, useOptimistic } from "react";

export type EditingItem = ItemUpdateInput & {
  id: string;
  updating?: boolean;
};

export type ItemReducerAction =
  | { type: "update"; item: EditingItem }
  | { type: "delete"; item: { id: string } }
  | { type: "add"; item: Item };

export const itemReducer = (
  state: (Item & { updating?: boolean })[],
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
      return state.filter((item) => item.id !== action.item.id);
    case "add":
      console.log("add", action.item);
      return [action.item, ...state];
    default:
      return state;
  }
};

export const ItemsContext = createContext<{
  items: (Item & { updating?: boolean })[];
  setItems: (action: ItemReducerAction) => void;
} | null>(null);

export const ItemsProvider = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: Item[];
}) => {
  const [optimisticItems, updateOptimisticItems] = useOptimistic<
    (Item & { updating?: boolean })[],
    ItemReducerAction
  >(items, itemReducer);

  return (
    <ItemsContext.Provider
      value={{ items: optimisticItems, setItems: updateOptimisticItems }}
    >
      {children}
    </ItemsContext.Provider>
  );
};
