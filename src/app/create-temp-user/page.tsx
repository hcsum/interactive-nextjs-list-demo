"use client";

import { Dialog, DialogActions, Button } from "@mui/material";
import { createTempUser } from "@/actions/user";
import { useMutation } from "@tanstack/react-query";

const CreateTempUserPage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: createTempUser,
  });

  return (
    <Dialog open>
      <DialogActions>
        <Button onClick={() => mutate()} disabled={isPending}>
          {isPending ? "Creating temp user..." : "Get Started"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTempUserPage;
