import { useContext } from "react";
import { OptimisticItemsContext } from "./OptimisticItemsProvider";

export const useOptimisticItemsContext = () => {
  const context = useContext(OptimisticItemsContext);
  if (!context) {
    throw new Error(
      "useOptimisticItemsContext must be used within a OptimisticItemsProvider",
    );
  }
  return context;
};
