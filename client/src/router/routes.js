import { createBrowserRouter } from "react-router";
import App from "@/App";
import { Login } from "@/pages/Login";

const router = createBrowserRouter([
  {
    children: [
      { index: true, Component: App },
      {
        path: "auth",
        children: [
          { path: "login", Component: Login },
        ],
      },
    ],
  },
]);
export default router;