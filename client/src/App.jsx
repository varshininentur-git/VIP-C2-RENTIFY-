import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import AddProperty from "./pages/AddProperty";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route
              path="dashboard/tenant"
              element={
                <ProtectedRoute allowedRole="tenant">
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/landlord"
              element={
                <ProtectedRoute allowedRole="owner">
                  <LandlordDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="properties/add"
              element={
                <ProtectedRoute allowedRole="owner">
                  <AddProperty />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/" element={<AuthLayout />}>
            <Route
              path="login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

