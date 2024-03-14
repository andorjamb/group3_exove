//React
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const loggedIn = useSelector((state: any) => state.auth.loggedIn);
  const isAdmin = useSelector((state: any) => state.auth.loggedIn);

  if (!loggedIn && sessionStorage.getItem("loggedIn") === "false")
    return (
      <>
        <Navigate to="/" replace />
      </>
    );

  return <Outlet />;
};

export default ProtectedRoutes;
