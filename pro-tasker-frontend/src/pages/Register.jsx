import { useState } from "react";
import { userClient } from "../clients/api.js";
import { useValidateRegister} from '../hooks/useValidate.js'
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import peep from "../assets/peep.webp";


function Register() {

    const { setUser } = useUser();
    const navigate = useNavigate();


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Clear error for that field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = useValidateRegister(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form submitted:", form);

      try {
        const { data } = await userClient.post("/register", form);
        console.log(data);
        localStorage.setItem("token", data.token);

        setUser(data.newUser);

        navigate("/dashboard");
        
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex">

  {/* Image Section */}
  <div className="w-1/2 hidden md:block">
    <img
      src={peep}
      alt="Register Visual"
      className="h-full w-full object-cover"
    />
  </div>

  {/*  Form Section */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12">

    {/* Headings */}
    <h2 className="text-xl sm:text-sm md:text-md lg:text-3xl font-bold text-gray-800 mb-4 text-center">
      Create Your Account
    </h2>

    <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-indigo-600 text-center">
        Join ProTasker
      </h1>

      <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
        Sign up today and take control of your tasks and projects efficiently.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">

        {/* FIRST + LAST NAME ROW */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* EMAIL */}
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="username"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          autoComplete="new-password"

          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold 
                     hover:bg-indigo-700 transition cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>

    {/* Login Link */}
    <p className="text-center text-gray-600 text-sm mt-6">
      Already have an account?{" "}
      <span
        className="text-indigo-600 font-semibold hover:underline cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Login
      </span>
    </p>

  </div>
</div>

  );
}

export default Register;