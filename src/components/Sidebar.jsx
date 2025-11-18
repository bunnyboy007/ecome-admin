


import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  PackageSearch,
  Tag,
  Ruler
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/add", label: "Add Items", icon: <PlusCircle size={20} /> },
  { to: "/list", label: "List Items", icon: <ListOrdered size={20} /> },
  { to: "/orders", label: "View Orders", icon: <PackageSearch size={20} /> },
  { to: "/category", label: "Add Category", icon: <Tag size={20} /> },
  { to: "/sizes", label: "Add Sizes", icon: <Ruler size={20} /> },
];

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col gap-2 pt-6 px-5">

        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition 
              ${isActive ? "bg-gray-900 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            {item.icon}
            <span className="text-[15px]">{item.label}</span>
          </NavLink>
        ))}

      </div>
    </div>
  );
};

export default Sidebar;
