import { useState } from "react";
import { userClient } from "../clients/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useValidateLogin } from "../hooks/useValidate";
import Logo from "../assets/protasker-logo3.png";
import bgImage from "../assets/bg.svg";
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
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-100 px-3 sm:px-6">

  {/* Main Card */}
  <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden">

    {/* Left Image Section */}
    <div className="hidden md:block md:w-1/2">
      <img
        src={bgImage}
        alt="Login Visual"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Login Section */}
    <div className="w-full md:w-1/2 p-6 sm:p-12 lg:p-20">

      {/* Logo */}
       {/* Logo */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <img src={Logo} alt="ProTasker Logo" className="h-20 sm:h-24 lg:h-28 object-contain" />
      </div>
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800 text-center mb-3 sm:mb-4">
        Welcome Back!
      </h2>

      {/* Subtitle */}
      <p className="text-gray-600 text-center mb-6 text-xs sm:text-base">
        Sign in to manage your tasks, stay organized, and boost your productivity.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

        {/* Email */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="username"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="cursor-pointer w-full py-2 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:bg-indigo-700 transition text-sm sm:text-base"
        >
          Login
        </button>

      </form>

      <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6">
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
</div>

    
  );
}

export default Login;