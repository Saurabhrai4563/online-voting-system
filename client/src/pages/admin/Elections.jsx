import { useEffect, useState } from "react";
import { getAllElections } from "@/services/election.service";
import ElectionTable from "@/components/elections/ElectionTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeleteElectionDialog from "@/components/elections/DeleteElectionDialog";
import ViewElectionDialog from "@/components/elections/ViewElectionDialog";
import CreateElectionDialog from "@/components/elections/CreateElectionDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const handleDelete = (election) => {
    setSelectedElection(election);
    setDeleteOpen(true);
  };
  const handleEdit = (election) => {
    setSelectedElection(election);
    setEditOpen(true);
  };
  useEffect(() => {
    fetchElections();
  }, []);

  const handleView = (election) => {
    setSelectedElection(election);
    setViewOpen(true);
  };
  const fetchElections = async () => {
    try {
      setLoading(true);

      const response = await getAllElections();

      setElections(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  const filteredElections = elections.filter((election) =>
    election.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Elections</h1>
          <p className="text-muted-foreground">
            Manage all elections from one place.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Election
        </Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search elections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <ElectionTable
        elections={filteredElections}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CreateElectionDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchElections}
      />
      <CreateElectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={fetchElections}
        election={selectedElection}
      />
      <ViewElectionDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        election={selectedElection}
      />
      <DeleteElectionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        election={selectedElection}
        onSuccess={fetchElections}
      />
    </div>
  );
}

export default Elections;
