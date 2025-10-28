import { cn } from "@utils/cn";
import { NavLink } from "react-router";

export const Sidebar = ({ logo, items, className = "" }) => {
  return (
    <nav className={cn("flex flex-col items-center m-4", className)}>
      {logo && <img src={logo} className="mb-6" />}
      <ul className="space-y-4 mt-10">
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-red-500" : "text-black"
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
