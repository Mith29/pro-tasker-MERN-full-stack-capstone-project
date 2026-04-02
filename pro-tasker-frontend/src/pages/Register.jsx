import { useState } from "react";
import { userClient } from "../clients/api.js";
import { useValidateRegister} from '../hooks/useValidate.js'
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import Logo from "../assets/protasker-logo3.png";


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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-4">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
    
    {/* Logo */}
    <div className="text-center mb-6">
      <img src={Logo} alt="Logo" className="h-50 mx-auto mb-2" />
      <h1 className="text-2xl font-bold text-gray-800">User Registration</h1>
    </div>

    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/** Input fields **/}
      {["firstName","lastName","email","password","confirmPassword"].map((field) => (
        <div key={field}>
          <label htmlFor={field} className="block text-gray-700 mb-1 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type={field.includes("password") ? "password" : "text"}
            id={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            autoComplete={field === "email" ? "email" : "given-name"}
            required
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        disabled={false} // you can set true while API call is in progress
      >
        Register
      </button>

      {/* Login Link */}
      <p className="text-center text-gray-500 text-sm mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>

    </form>
  </div>
</div>
  );
}

export default Register;