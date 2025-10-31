import { Sidebar } from "@/components/ui/SideBar";
import {
  budgetsLogo,
  sidebarItems,
  sideBarClass,
} from "@/components/config/sidebarConfig";
import { Card } from "@/components/ui/Card";

export const Budgets = () => {
  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={budgetsLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg"></Card>
    </main>
  );
};
