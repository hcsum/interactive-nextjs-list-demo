import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const LetGoDialog = ({
  open,
  onClose,
  onArchive,
  onDelete,
  onNotYet,
}: {
  open: boolean;
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onNotYet: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cluttered space, cluttered mind</DialogTitle>
      <DialogContent>
        <DialogContentText>Time to make a decision.</DialogContentText>
        <DialogActions>
          <Button onClick={onArchive}>Archive</Button>
          <Button onClick={onDelete}>Remove</Button>
          <Button onClick={onNotYet}>Not yet</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default LetGoDialog;
