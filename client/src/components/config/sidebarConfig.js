import sidebarHomeLogo from "@assets/home.png";
import sidebarTransactionLogo from "@assets/transactions.png";
import sidebarBudgetLogo from "@assets/budgets.png";
import sidebarAccountLogo from "@assets/account.png";

export const sidebarItems = [
  { name: "My Dashboard", path: "/dashboard" },
  { name: "Transactions", path: "/transactions" },
  { name: "Budgets", path: "/budgets" },
  { name: "Account", path: "/account" },
];

export const homeLogo = sidebarHomeLogo;
export const transactionLogo = sidebarTransactionLogo;
export const budgetsLogo = sidebarBudgetLogo;
export const accountLogo = sidebarAccountLogo;

export const sideBarClass = "bg-gray-300 rounded-xl shadow-md p-4 w-64";
