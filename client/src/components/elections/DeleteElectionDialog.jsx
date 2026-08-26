import { useState } from "react";
import { deleteElection } from "@/services/election.service";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

function DeleteElectionDialog({ open, onOpenChange, election, onSuccess }) {
  const [deleting, setDeleting] = useState(false);

  if (!election) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await deleteElection(election._id);

      toast.success("Election deleted successfully!");

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete election.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Election</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this election?
          </p>

          <p className="mt-3 font-medium">{election.title}</p>

          <p className="mt-2 text-sm text-red-600">
            This action cannot be undone.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Election"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteElectionDialog;
