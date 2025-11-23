import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import Sizes from "./pages/AddSizes";
import Category from "./pages/Category";
import Dashboard from "./pages/Dashboard";
import List from "./pages/List";
import Orders from "./pages/Orders";

//export const backendUrl =     "https://mern-ecome.onrender.com" ||  "http://localhost:4000";
export const backendUrl = "http://localhost:4000";
export const currency = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />

      {token ? (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>

                <Route path="/" element={<Dashboard />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/category" element={<Category token={token} />} />
                <Route path="/sizes" element={<Sizes />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
};
export default App;
