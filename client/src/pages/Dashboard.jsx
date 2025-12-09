import { Sidebar } from "@components/ui/SideBar";
import { Card } from "@/components/ui/Card";
import {
  homeLogo,
  sidebarItems,
  sideBarClass,
} from "@components/config/sidebarConfig";
import { SummaryCards } from "@/components/dashboard/SummaryCards";

export const Dashboard = () => {
  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar logo={homeLogo} items={sidebarItems} className={sideBarClass} />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg">
        <SummaryCards />
      </Card>
    </main>
  );
};
