import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/properties" },
  ];

  if (user) {
    const dashboardPath = user.role === "owner" ? "/dashboard/landlord" : "/dashboard/tenant";
    navItems.push({ label: "Dashboard", path: dashboardPath });
  } else {
    navItems.push({ label: "Login", path: "/login" }, { label: "Register", path: "/register" });
  }

  return (
    <header className="bg-[#F8F9FA] shadow-pastel">
      <div className="container flex items-center justify-between py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="rounded-md bg-[#CDB4DB] px-3 py-2 text-[#2F2E41] font-bold">R</div>
          <span className="text-lg font-semibold text-[#2F2E41]">Rentify</span>
        </NavLink>

        <nav className="hidden items-center gap-4 text-sm font-medium text-[#5F4A6D] md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#CDB4DB] px-4 py-2 text-[#2F2E41]"
                  : "rounded-full px-4 py-2 hover:bg-[#F4ECF7]"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-full bg-[#CDB4DB] px-4 py-2 text-sm font-medium text-[#2F2E41] transition hover:bg-[#B79BC6]"
            >
              Logout
            </button>
          )}
        </nav>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-[#E7D5E7] p-2"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#E7D5E7] bg-[#F8F3FB] md:hidden">
          <div className="container space-y-2 py-4">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#F4ECF7]">
                {item.label}
              </NavLink>
            ))}

            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full rounded-lg bg-[#CDB4DB] px-4 py-2 text-sm font-medium text-[#2F2E41]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
