import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      console.log("AuthContext: Loading from localStorage");
      console.log("Stored user:", storedUser);
      console.log("Stored token:", storedToken ? "Token exists" : "No token");
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          console.log("AuthContext: User and token loaded successfully");
        } catch (error) {
          console.error("AuthContext: Error parsing stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      } else {
        // No stored data, user needs to login
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login helper
  const login = (userData, authToken) => {
    console.log("AuthContext: Login called with:", { userData, hasToken: !!authToken });
    
    if (!authToken) {
      console.error("AuthContext: No token provided for login");
      return;
    }
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);
    
    console.log("AuthContext: Login successful, user and token stored");
  };

  // Logout helper
  const logout = () => {
    console.log("AuthContext: Logout called");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    console.log("AuthContext: Logout successful, data cleared");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Get username from email
  const getUsername = () => {
    if (!user) return 'User';
    
    if (user.name && user.name !== 'User') {
      return user.name;
    }
    
    if (user.email) {
      // Extract username from email (part before @)
      const emailParts = user.email.split('@');
      if (emailParts.length > 0) {
        const beforeAt = emailParts[0];
        // If there's a dot, take the part before the dot
        const dotParts = beforeAt.split('.');
        return dotParts[0];
      }
    }
    
    return 'User';
  };

  const value = {
    user,
    currentUser: user,
    token,
    isLoading,
    isAuthenticated: isAuthenticated(),
    getUsername,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  // If a component uses this hook outside of AuthProvider, avoid runtime crash
  if (!context) {
    // Provide sensible defaults to avoid runtime errors
    return {
      user: null,
      currentUser: null,
      token: null,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
};
