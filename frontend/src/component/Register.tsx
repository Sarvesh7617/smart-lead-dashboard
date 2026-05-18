import { useState } from "react";
import axiosInstance from "../helper/axiosHelper";
import type { AxiosError} from "axios";
import type { apiResponse } from "../Types/ApiResponse";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axiosInstance.post("/users/register", {
        name,
        email,
        password,
        role: "sales",
      });

      alert("Registered successfully");
      navigate("/");

    } 
    catch (error) {
      const axiosError = error as AxiosError<apiResponse<null>>;
      setError(axiosError?.response?.data?.message || "Registration failed");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h1 className="text-2xl mb-4 font-bold">Register</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="mt-3 text-center">
          Already have an account? <a href="/" className="text-blue-400 hover:text-blue-500">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;