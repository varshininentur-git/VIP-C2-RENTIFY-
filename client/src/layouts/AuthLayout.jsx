import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-indigo-700 px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-slate-950/10 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
