import { Sidebar } from "@/components/ui/SideBar";
import { PlaidButton } from "@/features/plaid/Plaidbutton";
import {
  sideBarClass,
  sidebarItems,
  accountLogo,
} from "@/components/config/sidebarConfig";

export const Account = () => {
  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={accountLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <PlaidButton></PlaidButton>
    </main>
  );
};
