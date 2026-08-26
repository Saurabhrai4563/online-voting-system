import { useState, useEffect } from "react";
import { createElection, updateElection } from "@/services/election.service";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CreateElectionDialog({ open, onOpenChange, onSuccess, election }) {
  const isEditMode = Boolean(election);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    if (election) {
      setFormData({
        title: election.title || "",
        description: election.description || "",
        startDate: election.startDate ? election.startDate.split("T")[0] : "",
        endDate: election.endDate ? election.endDate.split("T")[0] : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [election, open]);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.startDate || !formData.endDate) {
        toast.error("Please fill all required fields.");
        return;
      }

      if (isEditMode) {
        await updateElection(election._id, formData);
      } else {
        await createElection(formData);
      }

      onSuccess(); // Refresh table first

      toast.success(
        isEditMode
          ? "Election updated successfully!"
          : "Election created successfully!",
      );

      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });

      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Election" : "Create Election"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            name="title"
            placeholder="Election Title"
            value={formData.title}
            onChange={handleChange}
          />

          <Textarea
            name="description"
            placeholder="Election Description"
            value={formData.description}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit}>
            {isEditMode ? "Update Election" : "Create Election"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateElectionDialog;
