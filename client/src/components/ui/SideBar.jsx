import { cn } from "@utils/cn";
import logo from "@assets/logo.png";

export const Sidebar = ({ sideBarType, className = "" }) => {
  // Sidebar characteristics determined options
  const sideBarOptions = {
    dashboard: {
      image: logo,
      items: ["transactions", "budgets", "expenses"],
    },
  };

  return (
    <nav className={cn("flex flex-col items-center m-4", className)}>
      {sideBarOptions[sideBarType]?.["image"] && (
        <img src={logo} className="mb-6" />
      )}
      <ul className="space-y-4 mt-10">
        {sideBarOptions[sideBarType]?.["items"].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </nav>
  );
};
