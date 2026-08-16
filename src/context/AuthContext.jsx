import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary frontend auth simulation.
    // Replace with real backend JWT authentication later.
    const authStatus = sessionStorage.getItem("logikhata_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = () => {
    sessionStorage.setItem("logikhata_auth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("logikhata_auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
