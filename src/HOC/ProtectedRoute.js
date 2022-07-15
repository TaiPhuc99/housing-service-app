import React from "react";
import { Navigate } from "react-router-dom";
import UseAuthListener from "./UseAuthListener";
import Spinner from "../components/template/Spinner";

export default function ProtectedRoute({ Component }) {
  const { loggedIn, checkingStatus } = UseAuthListener();

  return (
    <>
      {
        // display a spinner while auth status being checked
        checkingStatus ? (
          <Spinner />
        ) : loggedIn ? (
          // if user is logged in, grant the access to the route
          <div>{Component}</div>
        ) : (
          // else render an unauthorised component
          // stating the reason why it cannot access the route
          <Navigate to="/sign-in" />
        )
      }
    </>
  );
}
