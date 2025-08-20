import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import {useHistory} from 'react-router-dom'
import authContext from "../Auth/store/auth-context";
const ProfileForm = () => {
  const authCtx = useContext(authContext);
  const newPasswordInputRef = useRef();
  const token = authCtx.token;
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB4flsAj8dncQ1rBlo5DUqgFkHIbb5vZMo",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      console.log("password changed");
      history.replace("/");
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          minLength="6"
          id="new-password"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
