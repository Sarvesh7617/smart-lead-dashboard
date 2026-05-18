import { useState } from "react";
import axiosInstance from "../helper/axiosHelper";
import type { AxiosError, AxiosResponse } from "axios";
import type { apiResponse } from "../Types/ApiResponse";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export interface userProps {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

interface loginProps {
  user: userProps;
  token: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {setUser}=useAuth();

  const navigate=useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res:AxiosResponse<apiResponse<loginProps>> = await axiosInstance.post('/users/login',{ email, password });

      alert("Login successful");

      setUser(res.data.data.user);

      // localStorage.setItem(
      //   "user",
      //   JSON.stringify(res.data.data.user)
      // );

      navigate("/dashboard");

    } 
    catch (error: any) {

      const axiosError=error as AxiosError<apiResponse<null>>
      setError(axiosError?.response?.data?.message || "Login failed");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-t shadow-md w-96">
        <h1 className="text-2xl mb-4 font-bold">Login</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

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

        <button type="submit" className="w-full bg-blue-500 text-white p-2" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <p className="bg-gray-100 w-96 p-2 bg-white shadow-md rounded-b text-center">
        Don’t have an account? <a href="/register" className="text-red-400 font-bold hover:text-red-500">Register</a>
      </p>
    </div>
  );
}