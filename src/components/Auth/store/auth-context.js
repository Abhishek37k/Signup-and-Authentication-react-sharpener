import React, {  useState } from "react";
import { useHistory } from "react-router-dom";
const authContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {

  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const history = useHistory();
  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    history.replace("/");
  };
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  // this is inside the authcontextprovider component
  return (
    <authContext.Provider value={contextValue}>
      {props.children}
    </authContext.Provider>
  );
};
export default authContext;
