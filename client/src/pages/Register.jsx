import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const validateEmail = (value) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(value);
};

const validatePhone = (value) => {
  const phoneRegex = /^[0-9()+\-\s]{7,20}$/;
  return phoneRegex.test(value);
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required.";
    }
    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!validateEmail(email.trim())) {
      validationErrors.email = "Enter a valid email address.";
    }
    if (!password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }
    if (!phone.trim()) {
      validationErrors.phone = "Phone number is required.";
    } else if (!validatePhone(phone.trim())) {
      validationErrors.phone = "Enter a valid phone number.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role,
      });
      navigate("/login");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Create your Rentify account</h1>
        <p className="mt-2 text-slate-300">Register as a Tenant or Owner to start listing or booking rentals.</p>
      </div>

      {errorMessage && <div className="rounded-3xl border border-red-300 bg-red-50 px-6 py-4 text-sm text-red-700">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-700 bg-slate-950/70 p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full rounded-3xl border px-5 py-4 outline-none focus:ring-2 focus:ring-sky-500/30 ${
                errors.name ? "border-red-400 bg-red-50 text-slate-900 focus:border-red-500" : "border-slate-700 bg-slate-950/70 text-white focus:border-sky-400"
              }`}
              placeholder="Full Name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full rounded-3xl border px-5 py-4 outline-none focus:ring-2 focus:ring-sky-500/30 ${
                errors.email ? "border-red-400 bg-red-50 text-slate-900 focus:border-red-500" : "border-slate-700 bg-slate-950/70 text-white focus:border-sky-400"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`w-full rounded-3xl border px-5 py-4 outline-none focus:ring-2 focus:ring-sky-500/30 ${
                errors.password ? "border-red-400 bg-red-50 text-slate-900 focus:border-red-500" : "border-slate-700 bg-slate-950/70 text-white focus:border-sky-400"
              }`}
              placeholder="Create password"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              className={`w-full rounded-3xl border px-5 py-4 outline-none focus:ring-2 focus:ring-sky-500/30 ${
                errors.phone ? "border-red-400 bg-red-50 text-slate-900 focus:border-red-500" : "border-slate-700 bg-slate-950/70 text-white focus:border-sky-400"
              }`}
              placeholder="Phone number"
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200">Role</label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: "user", label: "Tenant" },
              { value: "owner", label: "Landlord" },
            ].map((option) => (
              <label
                key={option.value}
                className={`inline-flex items-center gap-3 rounded-3xl border px-5 py-4 text-white transition ${
                  role === option.value
                    ? "border-sky-400 bg-sky-500/10"
                    : "border-slate-700 bg-slate-950/70 hover:border-sky-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="accent-sky-400"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-sky-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
