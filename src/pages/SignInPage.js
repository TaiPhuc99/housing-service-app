import React from "react";
import { Link } from "react-router-dom";
import GoogleAuth from "../components/user/GoogleAuth";
import SignInForm from "../components/user/SignInForm";

export default function SignInPage() {
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <SignInForm />

        <GoogleAuth />

        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}
