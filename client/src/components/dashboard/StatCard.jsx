function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>

          <h2 className="text-4xl font-bold mt-3">{value}</h2>
        </div>

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
