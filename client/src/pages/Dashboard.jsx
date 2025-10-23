import { Sidebar } from "@components/ui/SideBar";
import { PlaidButton } from "@/features/plaid/Plaidbutton";

export const Dashboard = () => {
  const dashBoardClass = "bg-gray-300 rounded-xl shadow-md p-4 w-64";

  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar sideBarType="dashboard" className={dashBoardClass} />
      <PlaidButton className="ml-auto"></PlaidButton>
    </main>
  );
};
