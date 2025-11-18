// import React from "react";
// import { assets } from "../assets/assets";
// import { Link } from "react-router-dom";

// const Navbar = ({ setToken }) => {
//   return (
//     <div className="top-0 left-0 z-50 w-full transition-all duration-300 bg-gray-600 bg-opacity-50 shadow-lg backdrop-blur-md">
//       <div className="flex items-center py-2 px-[4%] justify-between">
//         <Link to={"/"}>
//           <img className="w-44" src={assets.logo} alt="Trendify" />
//         </Link>
//         <button
//           onClick={() => setToken("")}
//           className="px-5 py-2 text-xs text-white bg-gray-800 rounded-full sm:px-7 sm:text-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="
      sticky top-0 left-0 z-50 
      bg-white/10 backdrop-blur-xl 
      border-b border-white/20
      shadow-[0_2px_15px_rgba(0,0,0,0.2)]
    ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={assets.logo} 
            alt="Trendify" 
            className="w-40 drop-shadow-md"
          />
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Logout Button */}
          <button
            onClick={() => setToken("")}
            className="
              px-5 py-2 rounded-full 
              bg-gradient-to-r from-gray-900 to-gray-700 
              text-white font-medium 
              text-sm shadow-lg
              hover:opacity-90 
              transition-all duration-300
            "
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
