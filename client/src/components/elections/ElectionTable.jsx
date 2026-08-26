import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

function ElectionTable({ elections, onView, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {elections.map((election) => (
            <TableRow
              key={election._id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{election.title}</TableCell>

              <TableCell>
                <StatusBadge status={election.status} />
              </TableCell>

              <TableCell>
                {new Date(election.startDate).toLocaleDateString()}
              </TableCell>

              <TableCell>
                {new Date(election.endDate).toLocaleDateString()}
              </TableCell>

              <TableCell>{election.createdBy.name}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onView(election)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onEdit(election)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onDelete(election)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ElectionTable;
