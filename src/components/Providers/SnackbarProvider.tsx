import { Snackbar, Alert } from "@mui/material";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

type SnackBarValue = {
  message: string;
  level: "info" | "error" | "success";
};

interface SnackBarContextValue {
  snackBarContent: SnackBarValue | undefined;
  setSnackBarContent: Dispatch<SetStateAction<SnackBarValue | undefined>>;
}

const SnackBarContext = createContext<SnackBarContextValue>({
  snackBarContent: undefined,
  setSnackBarContent: () => null,
});

const SnackBarProvider = ({ children }: { children?: ReactNode }) => {
  const [snackBarContent, setSnackBarContent] = useState<
    SnackBarValue | undefined
  >();

  return (
    <SnackBarContext.Provider
      value={{
        snackBarContent,
        setSnackBarContent,
      }}
    >
      <Snackbar
        autoHideDuration={5000}
        sx={{ p: 5 }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(snackBarContent)}
        onClose={() => setSnackBarContent(undefined)}
      >
        <Alert severity={snackBarContent?.level}>
          {snackBarContent?.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  );
};

const useSnackbarState = (): SnackBarContextValue => {
  if (!SnackBarContext) {
    throw new Error("useSnackbarState must be used within a SnackBarProvider");
  }
  const context = useContext(SnackBarContext);
  return context;
};

export { SnackBarProvider, useSnackbarState };
