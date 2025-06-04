import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/N-Logo.png";

const WelcomeScreen = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const CORRECT_USERID = import.meta.env.VITE_APP_USERID;
  const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userid.trim() || !password.trim()) {
      return toast.error("Please fill in both UserID and Password.");
    }

    if (userid !== CORRECT_USERID || password !== CORRECT_PASSWORD) {
      return toast.error("Invalid UserID or Password. Try again.");
    }

    sessionStorage.setItem("authenticated", "true");
    toast.success("Login successful! Redirecting…");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <ToastContainer position="top-center" />
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row max-w-[60vw] h-[60vh] max-h-[60vh]">
        <div className="bg-green-600 text-white flex flex-col items-center justify-center p-8 md:w-1/2">
          <img src={Logo} className="w-[20em] mb-8" alt="Logo" />
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-m text-center mb-6">
            To stay connected with your system, please login with your official
            credentials and manage your data smartly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 flex flex-col justify-center md:w-1/2"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-4">Login</h2>
          <p className="text-gray-600 mb-12">
            Login to your Private ERP Software
          </p>
          <input
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            type="text"
            placeholder="UserID"
            className="border border-gray-300 rounded-full px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-full px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
