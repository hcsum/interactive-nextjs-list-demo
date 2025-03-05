import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type DialogValue = {
  title: string;
  content: string;
  actions?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
};

interface DialogContextValue {
  dialogContent: DialogValue | undefined;
  setDialogContent: Dispatch<SetStateAction<DialogValue | undefined>>;
}

const DialogContext = createContext<DialogContextValue>({
  dialogContent: undefined,
  setDialogContent: () => null,
});

const DialogProvider = ({ children }: { children?: ReactNode }) => {
  const [dialogContent, setDialogContent] = useState<DialogValue | undefined>();

  const handleConfirm = () => {
    dialogContent?.onConfirm?.();
    setDialogContent(undefined);
  };

  const handleCancel = () => {
    dialogContent?.onCancel?.();
    setDialogContent(undefined);
  };

  return (
    <DialogContext.Provider
      value={{
        dialogContent,
        setDialogContent,
      }}
    >
      <Dialog
        open={Boolean(dialogContent)}
        onClose={() => setDialogContent(undefined)}
      >
        <DialogTitle>{dialogContent?.title}</DialogTitle>
        <DialogContent>{dialogContent?.content}</DialogContent>
        <DialogActions>
          {dialogContent?.actions || (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
};

const useDialogState = (): DialogContextValue => {
  if (!DialogContext) {
    throw new Error("useDialogState must be used within a DialogProvider");
  }
  const context = useContext(DialogContext);
  return context;
};

export { DialogProvider, useDialogState };
