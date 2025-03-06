"use client";

import { Collapse, IconButton } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddItemForm from "./AddItemForm";
import { Category } from "@prisma/client";
import { useOptimisticItemsContext } from "./Providers/useOptimisticItemsContext";

const AddItemPanel = ({ categories }: { categories: Category[] }) => {
  const { items } = useOptimisticItemsContext();
  const [isExpanded, setIsExpanded] = useState(items.length < 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div
        className="flex justify-between items-center px-4 py-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">Add Items</span>
        <IconButton
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
          className="text-gray-800 dark:text-gray-200"
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Collapse in={isExpanded}>
        <div className="p-4">
          <AddItemForm categories={categories} />
        </div>
      </Collapse>
    </div>
  );
};

export default AddItemPanel;
