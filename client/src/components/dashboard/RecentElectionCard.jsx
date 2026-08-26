import { CalendarDays, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function RecentElectionCard({ election }) {
  const getBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "upcoming":
        return "secondary";
      case "completed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{election.title}</h3>

        <Badge variant={getBadgeVariant(election.status)}>
          {election.status}
        </Badge>
      </div>

      <p className="text-gray-500 mt-3 line-clamp-2">{election.description}</p>

      <div className="flex items-center gap-2 mt-5 text-gray-600">
        <CalendarDays size={18} />

        <span>
          {formatDate(election.startDate)} - {formatDate(election.endDate)}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 text-gray-600">
        <User size={18} />

        <span>{election.createdBy.name}</span>
      </div>

      <Link
        to="/admin/elections"
        className="mt-6 flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
      >
        View Details
        <ArrowRight size={18} />
      </Link>
    </motion.div>
  );
}

export default RecentElectionCard;
