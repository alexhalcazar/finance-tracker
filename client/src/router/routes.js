import { createBrowserRouter } from "react-router";
import App from "@/App";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { AddExpense } from "@/pages/AddExpense";

const router = createBrowserRouter([
  {
    children: [
      { index: true, Component: App },
      {
        path: "auth",
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        path: "add-expense", // ✅ new route
        Component: AddExpense,
      },
    ],
  },
]);
export default router;
