import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Loader,
} from "lucide-react";

export default function Login_Signup({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const API = "http://localhost:9000/api";

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${API}/login`, form);

        if (res.data) {
        
          onLogin?.();
          navigate("/Dashboard");
        }
      } else {
        await axios.post(`${API}/signup`, form);

        alert("Account created successfully!");
        setIsLogin(true);
        setForm({ username: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      alert(isLogin ? "Invalid Username or Password" : "Fail to create new user . Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute bg-blue-500 rounded-full w-96 h-96 blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute bg-purple-500 rounded-full w-96 h-96 blur-3xl opacity-20 bottom-10 right-10"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[420px] max-w-[90%] p-10 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white font-bold"
      >
        {/* TITLE */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-600 rounded-full shadow-lg">
              {isLogin ? <LogIn size={30} /> : <UserPlus size={30} />}
            </div>
          </div>

          <h1 className="text-3xl font-extrabold">
            {isLogin ? "Welcome" : "Create Account"}
          </h1>

          <p className="mt-2 text-white/70">
            Stock Inventory Management System
          </p>
        </div>

        {/* USERNAME */}
        <div className="flex items-center px-4 py-3 mb-5 border bg-white/10 rounded-2xl border-white/20">
          <User className="text-white/70" />

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full ml-3 text-white bg-transparent outline-none placeholder:text-white/60"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center px-4 py-3 mb-6 border bg-white/10 rounded-2xl border-white/20">
          <Lock className="text-white/70" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full ml-3 text-white bg-transparent outline-none placeholder:text-white/60"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/70 hover:text-white"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 py-3 text-lg font-bold transition-all duration-300 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" />
              Processing...
            </>
          ) : isLogin ? (
            "Login"
          ) : (
            "Create Account"
          )}
        </button>

        {/* SWITCH */}
        <p className="mt-6 text-center text-white/80">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-cyan-300 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}