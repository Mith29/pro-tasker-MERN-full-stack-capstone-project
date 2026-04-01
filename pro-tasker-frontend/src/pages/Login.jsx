import { useState } from "react";
import { userClient } from "../clients/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useValidateLogin } from "../hooks/useValidate";
import Logo from "../assets/protasker-logo3.png";

function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = useValidateLogin(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const { data } = await userClient.post("/login", form);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white shadow-2xl border border-gray-200 rounded-3xl p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="ProTasker Logo" className="h-50" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;