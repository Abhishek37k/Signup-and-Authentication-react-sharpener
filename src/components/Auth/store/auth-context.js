import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const authContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const EXP_MS = 5 * 60 * 1000;

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const history = useHistory();
  const userIsLoggedIn = !!token;

  const timerRef = useRef(null);
  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const loginHandler = (newToken) => {
    const expiryAt = Date.now() + EXP_MS;
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiry", String(expiryAt));
    setToken(newToken);
    clearTimer();
    timerRef.current = setTimeout(() => logoutHandler(), EXP_MS);
  };

  const logoutHandler = () => {
    clearTimer();
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    history.replace("/"); // v5 navigation
  };

  useEffect(() => {
    const expiry = Number(localStorage.getItem("tokenExpiry") || 0);
    if (!initialToken || !expiry || Date.now() >= expiry) {
      logoutHandler(); // refresh after 5m => forced login
      return;
    }
    const remaining = Math.max(0, expiry - Date.now());
    timerRef.current = setTimeout(() => logoutHandler(), remaining);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = { token, isLoggedIn: userIsLoggedIn, login: loginHandler, logout: logoutHandler };

  return <authContext.Provider value={contextValue}>{props.children}</authContext.Provider>;
};

export default authContext;
