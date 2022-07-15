import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase.config";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Handle Submit
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign Up with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: userData.name,
      });

      // Add user to FireStore
      // Clone UserData
      const userDataClone = { ...userData };
      delete userDataClone.password;
      userDataClone.timestamp = serverTimestamp();

      // Add new Doc with auto generated ID
      await setDoc(doc(db, "users", user.uid), userDataClone);
      navigate("/");
      toast.success("Successfully Sign-Up");
    } catch (error) {
      toast.error("Something went wrong with registration");
    }
  };

  // Handle On Change with Input
  const onChange = (e) => {
    let { id, value } = e.target;
    setUserData((userData) => {
      return {
        ...userData,
        [id]: value,
      };
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-control">
        <input
          type="text"
          className="nameInput"
          placeholder="Name"
          id="name"
          value={userData.name}
          onChange={onChange}
        />
      </div>
      <div className="form-control">
        <input
          type="email"
          className="emailInput"
          placeholder="Email"
          id="email"
          value={userData.email}
          onChange={onChange}
        />
      </div>
      <div className="passwordInputDiv form-control">
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

      <div className="signUpBar">
        <p className="signUpText">Sign Up</p>
        <button className="signUpButton">
          <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
        </button>
      </div>
    </form>
  );
}
