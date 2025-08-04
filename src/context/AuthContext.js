import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      const decoded = jwtDecode(authToken);
      setUser(decoded);
      getCurrentUser(authToken)
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [authToken]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
