/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import GoogleAuth from "../components/user/GoogleAuth";
import SignUpForm from "../components/user/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <SignUpForm />

        <GoogleAuth />

        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}
