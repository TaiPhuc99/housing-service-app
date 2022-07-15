import React, { useState } from "react";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase.config";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Handle Submit with form
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;
      if (user) {
        navigate("/");
        toast.success("Successfully Sign-In");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
    }
  };

  // Get value from Input
  const onChange = (e) => {
    let { id, value } = e.target;
    setUserData({
      ...userData,
      [id]: value,
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        className="emailInput"
        placeholder="Email"
        id="email"
        value={userData.email}
        onChange={onChange}
      />

      <div className="passwordInputDiv">
        <input
          type={showPassword ? "text" : "password"}
          className="passwordInput"
          placeholder="Password"
          id="password"
          value={userData.password}
          onChange={onChange}
        />

        <img
          src={visibilityIcon}
          alt="show password"
          className="showPassword"
          onClick={() => setShowPassword((prevState) => !prevState)}
        />
      </div>

      <Link to="/forgot-password" className="forgotPasswordLink">
        Forgot Password
      </Link>

      <div className="signInBar" type="submit">
        <p className="signInText">Sign In</p>
        <button className="signInButton">
          <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
        </button>
      </div>
    </form>
  );
}
