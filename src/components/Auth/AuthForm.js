import { useState, useRef, useContext } from "react";
import {useHistory} from 'react-router-dom'
import classes from "./AuthForm.module.css";
import AuthContext from "./store/auth-context";
const AuthForm = () => {
  const authCtx = useContext(AuthContext);


const history = useHistory();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const HandleSubmit = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);

    let url;

    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4flsAj8dncQ1rBlo5DUqgFkHIbb5vZMo";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4flsAj8dncQ1rBlo5DUqgFkHIbb5vZMo";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("signup successful");
          setIsLoading(false);
          return response.json();
        } else {
          const data = await response.json();
          // alert("Error: " + data.error.message);
          throw new Error(data.error.message);
        }
      })
      .then((data) => {
        // console.log(data);

        authCtx.login(data.idToken);
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });

    // Reset form fields
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={HandleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}

          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
