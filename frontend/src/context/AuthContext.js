import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserFromToken, logout as clearToken } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
    setLoading(false);
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
