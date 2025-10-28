import { Sidebar } from "@components/ui/SideBar";
import {
  homeLogo,
  sidebarItems,
  sideBarClass,
} from "@components/config/sidebarConfig";

export const Dashboard = () => {
  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar logo={homeLogo} items={sidebarItems} className={sideBarClass} />
    </main>
  );
};
