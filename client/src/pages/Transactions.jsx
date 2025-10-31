import { Sidebar } from "@/components/ui/SideBar";
import {
  sidebarItems,
  sideBarClass,
  transactionLogo,
} from "@components/config/sidebarConfig";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { cn } from "@/utils/cn";

export const Transactions = ({ className }) => {
  let navigate = useNavigate();

  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={transactionLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <Button
        onClick={() => navigate("/transactions/add-expense")}
        className={cn(`max-h-24 m-4 ${className}`)}
      >
        Add an expense
      </Button>
    </main>
  );
};
