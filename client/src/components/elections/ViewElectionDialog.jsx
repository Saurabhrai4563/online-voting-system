import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import StatusBadge from "./StatusBadge";

function ViewElectionDialog({ open, onOpenChange, election }) {
  if (!election) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Election Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>

            <p className="font-medium">{election.title}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>

            <p className="text-sm">
              {election.description || "No description provided."}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>

            <StatusBadge status={election.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>

              <p className="font-medium">
                {new Date(election.startDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">End Date</p>

              <p className="font-medium">
                {new Date(election.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created By</p>

            <p className="font-medium">
              {election.createdBy?.name || "Unknown"}
            </p>

            <p className="text-sm text-muted-foreground">
              {election.createdBy?.email || ""}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewElectionDialog;
