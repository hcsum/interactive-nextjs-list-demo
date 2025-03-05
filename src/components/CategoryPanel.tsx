"use client";

import { useState } from "react";
import { Collapse, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Prisma } from "@prisma/client";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/category";
import { useActionState } from "react";
import { useDialogState } from "./Providers/DialogProvider";

interface CategoryPanelProps {
  categories: Prisma.CategoryGetPayload<null>[];
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({ categories }) => {
  const [editingCategory, setEditingCategory] =
    useState<Prisma.CategoryGetPayload<null> | null>(null);
  const { setDialogContent } = useDialogState();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    [field: string]: string[];
  }>({});

  const handleEditClick = (category: Prisma.CategoryGetPayload<null>) => {
    setValidationErrors({});
    setEditingCategory(category);
  };

  const handleInputChange = (value: string) => {
    setValidationErrors({});
    setEditingCategory((prev) => ({
      ...prev!,
      name: value,
    }));
  };

  const [addCategoryActionState, addCategoryAction, addingCategory] =
    useActionState(createCategory, undefined);

  const handleSaveClick = async (categoryId: string) => {
    try {
      if (!editingCategory) return;
      setIsUpdating(categoryId);

      const result = await updateCategory(categoryId, editingCategory.name);
      if (result?.errors) {
        setValidationErrors(result.errors);
        return;
      }
      setEditingCategory(null);
      setValidationErrors({});
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    setDialogContent({
      title: "Delete Category",
      content: "Are you sure you want to delete this category?",
      onConfirm: async () => {
        try {
          setIsDeleting(categoryId);
          const result = await deleteCategory(categoryId);
          if (result?.errors) {
            setValidationErrors(result.errors);
            return;
          }
        } catch (error) {
          console.error("Error deleting category:", error);
        } finally {
          setIsDeleting(null);
        }
      },
      onCancel: () => {
        setEditingCategory(null);
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-8">
      <div
        className="flex justify-between items-center px-4 py-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">Manage Categories</span>
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
          <form action={addCategoryAction} className="flex items-center mb-4">
            <TextField
              name="name"
              placeholder="New category name"
              size="small"
              variant="outlined"
              error={!!addCategoryActionState?.errors?.name}
              helperText={addCategoryActionState?.errors?.name?.join(", ")}
            />
            <button
              type="submit"
              disabled={addingCategory}
              className="ml-2 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingCategory ? (
                <div className="w-4 h-4 border-2 border-white-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <AddIcon />
              )}
            </button>
          </form>
          <div className="space-y-4 mb-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  {editingCategory?.id === category.id ? (
                    <TextField
                      fullWidth
                      value={editingCategory.name}
                      onChange={(e) => handleInputChange(e.target.value)}
                      size="small"
                      variant="outlined"
                      error={!!validationErrors.name}
                      helperText={validationErrors.name?.join(", ")}
                    />
                  ) : (
                    <div className="font-medium">{category.name}</div>
                  )}
                  <div className="flex gap-3">
                    {editingCategory?.id === category.id ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(category.id)}
                          disabled={isUpdating === category.id}
                          className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating === category.id ? (
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <SaveIcon />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={
                            isUpdating === category.id ||
                            isDeleting === category.id
                          }
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === category.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(category)}
                        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                      >
                        <EditIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center text-gray-500">
                <p>No category yet.</p>
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CategoryPanel;
