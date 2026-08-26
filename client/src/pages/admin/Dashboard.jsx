function Dashboard() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">👋 Welcome Back, {user?.name}</h1>

      <p className="text-gray-500 mt-2">
        Manage elections, candidates and monitor voting statistics.
      </p>
    </div>
  );
}

export default Dashboard;
