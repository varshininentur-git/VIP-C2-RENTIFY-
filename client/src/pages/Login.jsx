import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";

const validateEmail = (value) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(value);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email: email.trim(), password });
      const { user, token } = response.data;
      login(user, token);

      const defaultDestination = user?.role === "owner" ? "/dashboard/landlord" : "/dashboard/tenant";
      const destination = from && from.startsWith("/dashboard") ? defaultDestination : from || defaultDestination;
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Login to Rentify</h1>
        <p className="mt-2 text-slate-300">Access your tenant or landlord dashboard.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-300 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={`w-full rounded-3xl border px-5 py-4 text-white outline-none focus:ring-2 focus:ring-sky-500/30 ${
              formErrors.email ? "border-red-400 bg-red-50 text-slate-900 focus:border-red-500" : "border-slate-700 bg-slate-950/70 focus:border-sky-400"
            }`}
            placeholder="you@example.com"
          />
          {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors((prev) => ({ ...prev, password: "" }));
            }}
            className={`w-full rounded-3xl border px-5 py-4 text-white outline-none focus:ring-2 focus:ring-sky-500/30 ${
              formErrors.password ? "border-red-400 bg-red-50 text-slate-900 focus:border-red-500" : "border-slate-700 bg-slate-950/70 focus:border-sky-400"
            }`}
            placeholder="Enter password"
          />
          {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-sky-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
