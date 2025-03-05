import { createManyItems } from "@/actions/items";
import { DetectedItemChatGPT } from "@/lib/upload-helper-chatgpt";
import {
  Dialog,
  useMediaQuery,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ItemPlan } from "@prisma/client";
import { useState, useEffect } from "react";
import { CheckCircle, AddCircle } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { ERROR_FREE_TRAIL_ITEM_LIMIT } from "@/lib/definitions";
import { useSnackbarState } from "./Providers/SnackbarProvider";

interface AddingItemDialogProps {
  isOpen: boolean;
  detectedItems: DetectedItemChatGPT[];
  uploadedImage: string | null;
  onConfirm: (itemTotal: number) => void;
  onCancel: () => void;
}

interface DetectedItemWithChecked extends DetectedItemChatGPT {
  checked: boolean;
  pieces: number;
  deadline: number;
}

const AddingItemDialog = ({
  isOpen,
  detectedItems,
  uploadedImage,
  onConfirm,
  onCancel,
}: AddingItemDialogProps) => {
  const [editableItems, setEditableItems] = useState<DetectedItemWithChecked[]>(
    [],
  );
  const { setSnackBarContent } = useSnackbarState();

  useEffect(() => {
    if (detectedItems.length > 0) {
      setEditableItems(
        detectedItems.map((item) => ({
          ...item,
          checked: true,
          pieces: item.count,
          deadline: 6,
        })),
      );
    }
  }, [detectedItems]);

  const { isPending, mutate } = useMutation({
    mutationFn: createManyItems,
    onSettled(data) {
      if (data?.error === ERROR_FREE_TRAIL_ITEM_LIMIT) {
        setSnackBarContent({
          message: ERROR_FREE_TRAIL_ITEM_LIMIT,
          level: "error",
        });
      }
    },
  });

  const handleConfirm = () => {
    const confirmedItems = editableItems
      .filter((item) => item.checked)
      .map((item) => ({
        name: item.label,
        pieces: item.pieces,
        deadline: item.deadline,
        plan: ItemPlan.UNDECIDED,
      }));
    mutate(confirmedItems);
    onConfirm(confirmedItems.length);
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    setEditableItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, label: newLabel } : item,
      ),
    );
  };

  const handlePiecesChange = (index: number, pieces: number) => {
    setEditableItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, pieces: Math.max(1, pieces) } : item,
      ),
    );
  };

  const handleCheckChange = (index: number, checked: boolean) => {
    setEditableItems((items) =>
      items.map((item, i) => (i === index ? { ...item, checked } : item)),
    );
  };

  const handleDeadlineChange = (index: number, deadline: string) => {
    console.log("deadline", deadline);
    setEditableItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, deadline: parseInt(deadline) } : item,
      ),
    );
    console.log("editableItems", editableItems);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = ""; // Allow scrolling again
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-auto md:h-auto flex flex-col md:rounded-lg">
        <div className="relative">
          {uploadedImage && (
            <img src={uploadedImage} alt="Uploaded" className="w-full h-auto" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-4 mt-2">
          Detected Items: {detectedItems.length}
        </h3>
        <div className="flex flex-col h-full">
          {editableItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-2 justify-start items-baseline border-b border-gray-200 dark:border-gray-600 mb-8"
            >
              <button
                type="button"
                onClick={() => handleCheckChange(index, !item.checked)}
                className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  item.checked ? "text-green-500" : "text-gray-400"
                }`}
              >
                {item.checked ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AddCircle className="w-6 h-6" />
                )}
              </button>
              <div className="flex flex-col gap-2 mb-4 w-full md:flex-row md:gap-4 md:items-center">
                <TextField
                  label="Name"
                  id={`name-${index}`}
                  value={item.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <TextField
                  label="Pieces"
                  id={`pieces-${index}`}
                  type="number"
                  value={item.pieces ?? 1}
                  onChange={(e) =>
                    handlePiecesChange(index, parseInt(e.target.value))
                  }
                  className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <FormControl className="w-content">
                  <InputLabel id={`deadline-label-${index}`}>
                    Deadline
                  </InputLabel>
                  <Select
                    labelId={`deadline-label-${index}`}
                    id={`deadline-${index}`}
                    value={String(item.deadline ?? 6)}
                    onChange={(e) =>
                      handleDeadlineChange(index, e.target.value)
                    }
                    label="Deadline"
                    required
                  >
                    <MenuItem value="2">2 months</MenuItem>
                    <MenuItem value="3">3 months</MenuItem>
                    <MenuItem value="6">6 months</MenuItem>
                    <MenuItem value="9">9 months</MenuItem>
                    <MenuItem value="12">1 year</MenuItem>
                    <MenuItem value="18">1 and a half year</MenuItem>
                    <MenuItem value="24">2 years</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          ))}
          <p>{editableItems.filter((it) => it.checked).length} selected</p>
          <form action={handleConfirm} className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              disabled={isPending}
              className={`px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 rounded text-white hover:bg-blue-600 ${
                isPending
                  ? "bg-gray-500 text-gray-200 hover:bg-gray-500"
                  : "bg-blue-500"
              }`}
            >
              {isPending ? (
                <span className="flex items-center">
                  Adding{" "}
                  <CircularProgress
                    size={24}
                    color="inherit"
                    className="ml-2"
                  />
                </span>
              ) : (
                "Confirm"
              )}
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AddingItemDialog;
