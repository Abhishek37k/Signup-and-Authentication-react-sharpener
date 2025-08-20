import React, { use, useState } from "react";
import { useHistory } from "react-router-dom";
const authContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const history = useHistory();
  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
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
