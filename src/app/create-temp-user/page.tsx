"use client";

import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { createTempUser } from "@/actions/user";
import { useMutation } from "@tanstack/react-query";

const CreateTempUserPage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: createTempUser,
  });

  return (
    <Dialog open>
      <DialogTitle>Create a temp user to get started</DialogTitle>
      <DialogActions>
        <Button onClick={() => mutate()} disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTempUserPage;
