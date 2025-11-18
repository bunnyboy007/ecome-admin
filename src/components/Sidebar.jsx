// import React from "react";
// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";

// const Sidebar = () => {
//   return (
//     <div className="w-[18%] min-h-screen border-r-2">
//       <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">



//         <NavLink
//           className={
//             "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
//           }
//           to={"/"}
//         >
//           <img className="w-6 h-6" src={assets.add_icon} alt="Dashboards" />
//           <p className="hidden text-lg font-semibold md:block">Dashboard</p>
//         </NavLink>

//         <NavLink
//           className={
//             "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
//           }
//           to={"/add"}
//         >
//           <img className="w-6 h-6" src={assets.add_icon} alt="Add Items" />
//           <p className="hidden text-lg font-semibold md:block">Add Items</p>
//         </NavLink>
//         <NavLink
//           className={
//             "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
//           }
//           to={"/list"}
//         >
//           <img className="w-6 h-6" src={assets.parcel_icon} alt="List Items" />
//           <p className="hidden text-lg font-semibold md:block">List Items</p>
//         </NavLink>
        

//         <NavLink
//           className={
//             "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
//           }
//           to={"/orders"}
//         >
//           <img className="w-6 h-6" src={assets.order_icon} alt="Add Products" />
//           <p className="hidden text-lg font-semibold md:block">View Orders</p>
//         </NavLink>



//         <NavLink
//           className={
//             "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
//           }
//           to={"/category"}
//         >
//           <img className="w-6 h-6" src={assets.order_icon} alt="category" />
//           <p className="hidden text-lg font-semibold md:block">Add Category</p>
//         </NavLink>


//    <NavLink
//           className={
//             "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200"
//           }
//           to={"/sizes"}
//         >
//           <img className="w-6 h-6" src={assets.order_icon} alt="category" />
//           <p className="hidden text-lg font-semibold md:block">Add sizes</p>
//         </NavLink>

//       </div>
//     </div>
//   );
// };

// export default Sidebar;







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
