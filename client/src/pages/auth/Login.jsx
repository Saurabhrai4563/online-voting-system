import { useState } from "react";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();
  console.log("Current User:", user);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      login(data.user, data.token);

      console.log(data.user);
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Online Voting System</h1>

          <p className="text-lg">Secure • Transparent • Fast</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold">Welcome Back</h2>

          <p className="mt-2 text-gray-500">Sign in to your account</p>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
