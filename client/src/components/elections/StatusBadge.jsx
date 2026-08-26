import { Badge } from "@/components/ui/badge";

function StatusBadge({ status }) {
  const variants = {
    active: "bg-green-100 text-green-700 hover:bg-green-100",
    upcoming: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    completed: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  return (
    <Badge className={variants[status] || "bg-gray-100 text-gray-700"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default StatusBadge;
