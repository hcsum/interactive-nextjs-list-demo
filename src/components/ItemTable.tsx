"use client";

import { deleteItem, updateItem } from "@/actions/items";
import { Category } from "@prisma/client";
import { useEffect, useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import { MenuItem, Pagination, Select, Chip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { formatDistanceToNow } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ItemSkeleton from "./ItemSkeleton";
import { useDialogState } from "./Providers/DialogProvider";
import { OptimisticItem } from "./Providers/OptimisticItemsProvider";
import { useOptimisticItemsContext } from "./Providers/useOptimisticItemsContext";
import "@/app/styles.css";

const ItemTable = ({
  categories,
  totalPages,
  currentPage,
  category,
  search,
}: {
  categories: Category[];
  totalPages: number;
  currentPage: number;
  category: string;
  search: string;
}) => {
  const router = useRouter();
  const categoryMap = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category.id] = category;
        return acc;
      },
      {} as Record<string, Category>,
    );
  }, [categories]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{
    [field: string]: string[];
  }>({});
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(currentPage);
  const { setDialogContent } = useDialogState();
  const { items, updateOptimisticItems } = useOptimisticItemsContext();

  const queryObject = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    return params;
  }, [searchQuery, selectedCategory, page]);

  useEffect(() => {
    setPage(currentPage);
    setSelectedCategory(category);
    setSearchQuery(search);
  }, [currentPage, category, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const updatedParams = new URLSearchParams(queryObject);
    updatedParams.set("page", "1");
    updatedParams.delete("search");
    startTransition(() => {
      router.push(`/?${updatedParams.toString()}`);
    });
  };

  const handleSearchSubmit = () => {
    startTransition(() => {
      const updatedParams = new URLSearchParams(queryObject);
      updatedParams.set("page", "1");
      router.push(`/?${updatedParams.toString()}`);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleItemChange = async (formData: FormData) => {
    const action = formData.get("action") as string;
    const itemId = formData.get("itemId") as string;
    const name = formData.get("name") as string;
    const pieces = parseInt(formData.get("pieces") as string);
    const deadline = new Date(formData.get("deadline") as string);
    const categoryId = formData.get("categoryId") as string;

    if (action === "delete") {
      setDialogContent({
        title: "Confirm Deletion",
        content: `Are you sure you want to delete ${name}?`,
        onConfirm: async () => {
          updateOptimisticItems({ type: "delete", itemId });
          deleteItem(itemId);
        },
      });
      return;
    }

    const data = {
      id: itemId,
      name,
      pieces,
      deadline,
      categoryId,
    };

    updateOptimisticItems({ type: "update", item: data });

    const result = await updateItem(itemId, data);

    if (result?.errors) {
      setValidationErrors(result.errors);
      return;
    }
    setValidationErrors({});
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPage(page);
    const updatedParams = new URLSearchParams(queryObject);
    updatedParams.set("page", page.toString());
    startTransition(() => {
      router.push(`/?${updatedParams.toString()}`);
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const updatedParams = new URLSearchParams(queryObject);
    if (selectedCategory === categoryId) {
      updatedParams.delete("category");
      setSelectedCategory("");
    } else {
      updatedParams.set("category", categoryId);
      setSelectedCategory(categoryId);
    }

    updatedParams.set("page", "1");
    startTransition(() => {
      router.push(`/?${updatedParams.toString()}`);
    });
  };

  return (
    <div className="mb-6">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center mb-4 md:w-[50%] gap-2 p-2">
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            clickable
            disabled={isPending}
            color={selectedCategory === category.id ? "primary" : "default"}
            onClick={() => handleCategoryChange(category.id)}
            className="m-1"
          />
        ))}
      </div>
      {/* Search Box */}
      <div className="flex items-center mb-4 md:w-[50%]">
        <div className="relative flex-1">
          <TextField
            fullWidth
            placeholder="Search items"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            size="small"
            variant="outlined"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={handleSearchSubmit}
          className="ml-2 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          <SearchIcon />
        </button>
      </div>
      <Pagination
        className="my-4"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />
      {isPending ? (
        <ItemSkeleton />
      ) : (
        <div className={`space-y-4 mb-6 `}>
          {items.map((item) => {
            return (
              <ItemForm
                key={item.id}
                item={item}
                validationErrors={validationErrors}
                categoryMap={categoryMap}
                categories={categories}
                handleChange={handleItemChange}
              />
            );
          })}
          {items.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No items found. Add an item or change the filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ItemForm = ({
  item,
  validationErrors,
  categoryMap,
  categories,
  handleChange,
}: {
  item: OptimisticItem;
  validationErrors: {
    [field: string]: string[];
  };
  categoryMap: Record<string, Category>;
  categories: Category[];
  handleChange: (formData: FormData) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
    handleChange(new FormData(event.target as HTMLFormElement));
  };

  const isNewlyModified =
    new Date().getTime() - new Date(item.updatedAt).getTime() < 1000 * 10;

  return (
    <div
      key={item.id}
      className={`p-4 md:p-8 border rounded-lg transition-colors ${
        isNewlyModified ? "fade-animation" : ""
      }`}
    >
      <form
        onSubmit={handleSave}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <input type="hidden" name="itemId" value={item.id} />
        <div className="flex-[1.5]">
          <div className="text-sm text-gray-500 dark:text-gray-400">Item:</div>
          {isEditing ? (
            <TextField
              fullWidth
              defaultValue={item.name}
              name="name"
              error={!!validationErrors.name}
              helperText={validationErrors.name?.join(", ")}
              size="small"
              variant="outlined"
            />
          ) : (
            <h3 className="text-gray-900 dark:text-gray-100 max-w-[200px] break-words">
              {item.name}
            </h3>
          )}
        </div>

        <div className="flex-[0.5]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pieces:
          </div>
          {isEditing ? (
            <TextField
              type="number"
              defaultValue={item.pieces}
              name="pieces"
              error={!!validationErrors.pieces}
              helperText={validationErrors.pieces?.join(", ")}
              size="small"
              variant="outlined"
            />
          ) : (
            <div className="text-gray-900 dark:text-gray-100">
              {item.pieces}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Category:
          </div>
          {isEditing ? (
            <Select
              defaultValue={item.categoryId ?? ""}
              name="categoryId"
              size="small"
              variant="outlined"
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <div className="text-gray-900 dark:text-gray-100">
              {categoryMap[item.categoryId ?? ""]?.name ?? "-"}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Deadline:
          </div>
          {isEditing ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                name="deadline"
                defaultValue={item.deadline}
                shouldDisableDate={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date <= today;
                }}
                format="MM/dd/yyyy"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!validationErrors.deadline,
                    helperText: validationErrors.deadline?.join(", "),
                  },
                }}
              />
            </LocalizationProvider>
          ) : (
            <div className="text-gray-900 dark:text-gray-100">
              {`${formatDistanceToNow(item.deadline, {
                addSuffix: true,
              })}`}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                name="action"
                value="update"
                type="submit"
                className="p-2 text-green-500 hover:bg-green-100 rounded-lg dark:hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SaveIcon />
              </button>
              <button
                name="action"
                value="delete"
                type="submit"
                className="p-2 text-red-500 hover:bg-red-200 rounded-lg dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DeleteIcon />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg dark:hover:bg-blue-900"
              onClick={(event) => {
                event.preventDefault();
                handleEdit();
              }}
            >
              <EditIcon />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItemTable;
