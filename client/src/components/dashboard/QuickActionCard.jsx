import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function QuickActionCard({ title, description, icon, color, to }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={to}>
        <div
          className={`rounded-2xl p-6 shadow-md text-white ${color} transition`}
        >
          <div className="text-4xl mb-4">{icon}</div>

          <h2 className="text-xl font-bold">{title}</h2>

          <p className="mt-2 text-sm opacity-90">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default QuickActionCard;
