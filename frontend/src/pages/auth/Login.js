import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      toast.warning("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);
      const token = res.data.token;
      login(token);
      const decoded = jwtDecode(token);
      toast.success("Welcome back!");
      if (decoded.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" id="login-page">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to BookHaven</h1>
          <p className="text-surface-300 text-lg">Discover thousands of books from every genre. Your next great read awaits.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold">Book<span className="text-brand-500">Haven</span></span>
          </div>

          <h2 className="text-3xl font-bold text-surface-900 mb-2">Sign In</h2>
          <p className="text-surface-500 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
              <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@example.com" className="input" id="login-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} placeholder="••••••••" className="input" id="login-password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base" id="login-submit">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;