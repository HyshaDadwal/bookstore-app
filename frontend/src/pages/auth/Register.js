import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password) {
      toast.warning("Please fill in all fields");
      return;
    }
    if (data.password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", data);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getStrength = () => {
    const p = data.password;
    if (!p) return { level: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-400" };
    if (score <= 3) return { level: 2, label: "Medium", color: "bg-amber-400" };
    return { level: 3, label: "Strong", color: "bg-emerald-400" };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen flex" id="register-page">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-brand-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Join BookHaven</h1>
          <p className="text-surface-300 text-lg">Create your account and start your reading journey today.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <h2 className="text-3xl font-bold text-surface-900 mb-2">Create Account</h2>
          <p className="text-surface-500 mb-8">Fill in your details to get started</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
              <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="John Doe" className="input" id="register-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
              <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@example.com" className="input" id="register-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} placeholder="••••••••" className="input" id="register-password" />
              {data.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : "bg-surface-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-surface-500">{strength.label}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base" id="register-submit">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;