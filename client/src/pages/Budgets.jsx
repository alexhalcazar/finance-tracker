import { Sidebar } from "@/components/ui/SideBar";
import {
  budgetsLogo,
  sidebarItems,
  sideBarClass,
} from "@/components/config/sidebarConfig";

export const Budgets = () => {
  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={budgetsLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
    </main>
  );
};
