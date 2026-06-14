import { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext();

const getStoredUser = () => {
  const storedUser = localStorage.getItem("rentify_user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem("rentify_token"));

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("rentify_user", JSON.stringify(userData));
    localStorage.setItem("rentify_token", jwtToken);
    setAuthToken(jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rentify_user");
    localStorage.removeItem("rentify_token");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
