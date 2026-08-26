import {
  Users,
  UserCheck,
  ShieldCheck,
  Vote,
  CalendarClock,
  CalendarDays,
  CheckCircle,
  Trophy,
  BarChart3,
  PlusCircle,
  ClipboardList,
  ChartColumn,
} from "lucide-react";
import { getAllElections } from "@/services/election.service";
import RecentElectionCard from "@/components/dashboard/RecentElectionCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboard.service";
import StatCard from "@/components/dashboard/StatCard";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentElections, setRecentElections] = useState([]);

  const { user } = useAuth();

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.data); // Store only the dashboard data
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRecentElections = async () => {
    try {
      const response = await getAllElections();

      // Store only first 3 elections
      setRecentElections(response.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDashboard();
    fetchRecentElections();
  }, []);

  if (!stats) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }
  const dashboardCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="text-white" size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Voters",
      value: stats.totalVoters,
      icon: <UserCheck className="text-white" size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      icon: <ShieldCheck className="text-white" size={28} />,
      color: "bg-purple-500",
    },
    {
      title: "Total Elections",
      value: stats.totalElections,
      icon: <Vote className="text-white" size={28} />,
      color: "bg-indigo-500",
    },
    {
      title: "Active Elections",
      value: stats.activeElections,
      icon: <CalendarClock className="text-white" size={28} />,
      color: "bg-emerald-500",
    },
    {
      title: "Upcoming Elections",
      value: stats.upcomingElections,
      icon: <CalendarDays className="text-white" size={28} />,
      color: "bg-yellow-500",
    },
    {
      title: "Completed Elections",
      value: stats.completedElections,
      icon: <CheckCircle className="text-white" size={28} />,
      color: "bg-red-500",
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      icon: <Trophy className="text-white" size={28} />,
      color: "bg-orange-500",
    },
    {
      title: "Total Votes",
      value: stats.totalVotes,
      icon: <BarChart3 className="text-white" size={28} />,
      color: "bg-cyan-500",
    },
  ];
  return (
    <div className="p-6">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 shadow-xl"
          >
            <h1 className="text-4xl font-bold">
              Welcome back, {user?.name} 👋
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Ready to manage today's elections?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">⚡ Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Create Election"
            description="Create and manage elections."
            icon={<PlusCircle size={40} />}
            color="bg-blue-600"
            to="/admin/elections"
          />

          <QuickActionCard
            title="Manage Candidates"
            description="View and manage candidates."
            icon={<ClipboardList size={40} />}
            color="bg-green-600"
            to="/admin/candidates"
          />

          <QuickActionCard
            title="View Results"
            description="Check election results."
            icon={<ChartColumn size={40} />}
            color="bg-purple-600"
            to="/admin/results"
          />
        </div>
      </div>
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📋 Recent Elections</h2>

          <Link to="/admin/elections" className="text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recentElections.map((election) => (
            <RecentElectionCard key={election._id} election={election} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
