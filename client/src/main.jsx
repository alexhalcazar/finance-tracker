import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import router from "@/router/routes";

// importing globals first will allow access to other descending style sheets
import "@/styles/globals.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
