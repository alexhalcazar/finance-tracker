import { Sidebar } from "@components/ui/SideBar";
import { Card } from "@/components/ui/Card";
import {
  homeLogo,
  sidebarItems,
  sideBarClass,
} from "@components/config/sidebarConfig";
import { IncomeCard } from "@/components/dashboard/IncomeCard";

export const Dashboard = () => {
  //grab expenses
  const expenses = 0;
  //grab budget
  const budget = 0;

  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar logo={homeLogo} items={sidebarItems} className={sideBarClass} />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-around">
          <IncomeCard />
          <Card className="p-4 bg-rose-400 text-center rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]">
            <div className="text-sm font-medium">Expenses</div>
            <div className="text-2xl font-bold text-gray-900">{`$${expenses}`}</div>
          </Card>
          <Card className="p-4 bg-white text-center rounded-lg shadow-md flex-1 min-w-[200px] max-w-[300px]">
            <div className="text-sm font-medium"> Remaining Budget</div>
            <div className="text-2xl font-bold text-gray-900">{`$${budget}`}</div>
          </Card>
        </div>
      </Card>
    </main>
  );
};
