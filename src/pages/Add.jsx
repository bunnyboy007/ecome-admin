

// import React, { useEffect, useState } from "react";
// import { assets } from "../assets/assets";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Add = ({ token }) => {
//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState(null);
//   const [image3, setImage3] = useState(null);
//   const [image4, setImage4] = useState(null);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [subCategory, setSubCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [sizes, setSizes] = useState([]);
//   const [bestSeller, setBestSeller] = useState(false);

//   // 🚀 Shipping details (for Shiprocket)
//   const [weight, setWeight] = useState("");
//   const [length, setLength] = useState("");
//   const [breadth, setBreadth] = useState("");
//   const [height, setHeight] = useState("");
//   const [declaredValue, setDeclaredValue] = useState("");
//   const [mode, setMode] = useState("Surface"); // Default mode
//   const [cod, setCod] = useState(0);

//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);

//   // ✅ Fetch categories and subcategories
//   const fetchCategories = async () => {
//     try {
//       const catRes = await axios.get(`${backendUrl}/api/product/categories`);
//       const subRes = await axios.get(`${backendUrl}/api/product/subcategories`);
//       setCategories(catRes.data.data || []);
//       setSubCategories(subRes.data.data || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       image1 && formData.append("image1", image1);
//       image2 && formData.append("image2", image2);
//       image3 && formData.append("image3", image3);
//       image4 && formData.append("image4", image4);

//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("category", category);
//       formData.append("subCategory", subCategory);
//       formData.append("price", price);
//       formData.append("sizes", JSON.stringify(sizes));
//       formData.append("bestSeller", bestSeller);

//       // 🚀 Add shipping details
//       formData.append("weight", weight);
//       formData.append("length", length);
//       formData.append("breadth", breadth);
//       formData.append("height", height);
//       formData.append("declared_value", declaredValue);
//       formData.append("mode", mode);
//       formData.append("cod", cod);

//       const response = await axios.post(
//         `${backendUrl}/api/product/add`,
//         formData,
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         resetForm();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   };

//   const resetForm = () => {
//     setImage1(null);
//     setImage2(null);
//     setImage3(null);
//     setImage4(null);
//     setName("");
//     setDescription("");
//     setCategory("");
//     setSubCategory("");
//     setPrice("");
//     setSizes([]);
//     setBestSeller(false);
//     setWeight("");
//     setLength("");
//     setBreadth("");
//     setHeight("");
//     setDeclaredValue("");
//     setMode("Surface");
//     setCod(0);
//   };

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-start w-full gap-3"
//     >
//       {/* Upload Images */}
//       <div>
//         <p className="mb-2 text-lg font-semibold">Upload Product Image(s)</p>
//         <div className="flex gap-2">
//           {[1, 2, 3, 4].map((num) => (
//             <label key={num} htmlFor={`image${num}`}>
//               <img
//                 className="w-20 border-2 border-gray-500 rounded-lg cursor-pointer"
//                 src={
//                   !eval(`image${num}`)
//                     ? assets.upload_area
//                     : URL.createObjectURL(eval(`image${num}`))
//                 }
//                 alt={`Upload ${num}`}
//               />
//               <input
//                 onChange={(e) => eval(`setImage${num}(e.target.files[0])`)}
//                 type="file"
//                 id={`image${num}`}
//                 hidden
//                 accept="image/*"
//               />
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Name */}
//       <div className="w-full mt-2">
//         <p className="mb-2 text-lg font-semibold">Product Name</p>
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
//           type="text"
//           placeholder="Enter Product Name"
//           required
//         />
//       </div>

//       {/* Description */}
//       <div className="w-full mt-2">
//         <p className="mb-2 text-lg font-semibold">Description</p>
//         <textarea
//           onChange={(e) => setDescription(e.target.value)}
//           value={description}
//           className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
//           placeholder="Enter Product Description"
//           required
//         />
//       </div>

//       {/* Category & Subcategory */}
//       <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
//         <div>
//           <p className="mb-2 text-lg font-semibold">Category</p>
//           <select
//             onChange={(e) => setCategory(e.target.value)}
//             value={category}
//             className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat.name}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <p className="mb-2 text-lg font-semibold">Subcategory</p>
//           <select
//             onChange={(e) => setSubCategory(e.target.value)}
//             value={subCategory}
//             className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
//             required
//           >
//             <option value="">Select Sub Category</option>
//             {subCategories.map((sub) => (
//               <option key={sub._id} value={sub.name}>
//                 {sub.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <p className="mb-2 text-lg font-semibold">Price (₹)</p>
//           <input
//             onChange={(e) => setPrice(e.target.value)}
//             value={price}
//             className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
//             type="number"
//             placeholder="Enter Price"
//             required
//           />
//         </div>
//       </div>

//       {/* 🚀 Shipping Details */}
//       <div className="mt-4">
//         <p className="mb-2 text-lg font-semibold">Shipping Details</p>
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
//           <input
//             type="number"
//             placeholder="Weight (kg)"
//             value={weight}
//             onChange={(e) => setWeight(e.target.value)}
//             className="px-3 py-2 border-gray-500"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Length (cm)"
//             value={length}
//             onChange={(e) => setLength(e.target.value)}
//             className="px-3 py-2 border-gray-500"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Breadth (cm)"
//             value={breadth}
//             onChange={(e) => setBreadth(e.target.value)}
//             className="px-3 py-2 border-gray-500"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Height (cm)"
//             value={height}
//             onChange={(e) => setHeight(e.target.value)}
//             className="px-3 py-2 border-gray-500"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Declared Value (₹)"
//             value={declaredValue}
//             onChange={(e) => setDeclaredValue(e.target.value)}
//             className="px-3 py-2 border-gray-500"
//             required
//           />
//           <select
//             value={mode}
//             onChange={(e) => setMode(e.target.value)}
//             className="px-3 py-2 border-gray-500"
//           >
//             <option value="Surface">Surface</option>
//             <option value="Air">Air</option>
//           </select>
//         </div>
//         <div className="flex items-center mt-2">
//           <label className="mr-2">COD (1 for yes / 0 for no):</label>
//           <input
//             type="number"
//             value={cod}
//             onChange={(e) => setCod(e.target.value)}
//             className="w-20 px-2 py-1 border-gray-500"
//             min="0"
//             max="1"
//           />
//         </div>
//       </div>

//       {/* Sizes */}
//       <div>
//         <p className="mb-2 text-lg font-semibold">Available Sizes</p>
//         <div className="flex gap-3">
//           {["S", "M", "L", "XL", "XXL"].map((size) => (
//             <p
//               key={size}
//               onClick={() =>
//                 setSizes((prev) =>
//                   prev.includes(size)
//                     ? prev.filter((item) => item !== size)
//                     : [...prev, size]
//                 )
//               }
//               className={`${
//                 sizes.includes(size)
//                   ? "bg-gray-500 text-white rounded-md"
//                   : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               {size}
//             </p>
//           ))}
//         </div>
//       </div>

//       {/* Best Seller */}
//       <div className="flex gap-2 mt-2">
//         <input
//           type="checkbox"
//           id="bestSeller"
//           checked={bestSeller}
//           onChange={() => setBestSeller((prev) => !prev)}
//         />
//         <label htmlFor="bestSeller" className="ml-2 cursor-pointer">
//           Add to Best Seller
//         </label>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
//         <button
//           type="submit"
//           className="px-5 py-2 mt-2 text-white rounded-lg bg-slate-700"
//         >
//           Add Product
//         </button>
//         <button
//           type="button"
//           className="px-5 py-2 mt-2 text-white rounded-lg bg-slate-700"
//           onClick={resetForm}
//         >
//           Reset Details
//         </button>
//       </div>
//     </form>
//   );
// };

// export default Add;





import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  // 🚀 Shipping details (for Shiprocket)
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [mode, setMode] = useState("Surface");
  const [cod, setCod] = useState(0);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // ✨ Product Types & Dynamic Sizes
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);

const [extraAmount, setExtraAmount] = useState("");




  // ✅ Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      const catRes = await axios.get(`${backendUrl}/api/product/categories`);
      const subRes = await axios.get(`${backendUrl}/api/product/subcategories`);
      setCategories(catRes.data.data || []);
      setSubCategories(subRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  // ✨ Fetch Product Types
  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product-type/all`);
      if (response.data.success) {
        setProductTypes(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product types");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductTypes();
  }, []);

  // ✨ Handle Product Type Selection
  const handleProductTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedProductType(selectedType);
    
    // Find the selected product type and set available sizes
    const productType = productTypes.find(type => type.name === selectedType);
    if (productType) {
      setAvailableSizes(productType.sizes || []);
      setSizes([]); // Reset selected sizes when product type changes
    } else {
      setAvailableSizes([]);
      setSizes([]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      // 🚀 Add shipping details
      formData.append("weight", weight);
      formData.append("length", length);
      formData.append("breadth", breadth);
      formData.append("height", height);
      formData.append("declared_value", declaredValue);
      formData.append("mode", mode);
      formData.append("cod", cod);
      formData.append("extraAmount", extraAmount);


      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
    setWeight("");
    setLength("");
    setBreadth("");
    setHeight("");
    setDeclaredValue("");
    setMode("Surface");
    setCod(0);
    setSelectedProductType("");
    setAvailableSizes([]);
    setExtraAmount("");
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start w-full gap-3"
    >
      {/* Upload Images */}
      <div>
        <p className="mb-2 text-lg font-semibold">Upload Product Image(s)</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <label key={num} htmlFor={`image${num}`}>
              <img
                className="w-20 border-2 border-gray-500 rounded-lg cursor-pointer"
                src={
                  !eval(`image${num}`)
                    ? assets.upload_area
                    : URL.createObjectURL(eval(`image${num}`))
                }
                alt={`Upload ${num}`}
              />
              <input
                onChange={(e) => eval(`setImage${num}(e.target.files[0])`)}
                type="file"
                id={`image${num}`}
                hidden
                accept="image/*"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="w-full mt-2">
        <p className="mb-2 text-lg font-semibold">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
          type="text"
          placeholder="Enter Product Name"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full mt-2">
        <p className="mb-2 text-lg font-semibold">Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
          placeholder="Enter Product Description"
          required
        />
      </div>

      {/* Category & Subcategory */}
      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <div>
          <p className="mb-2 text-lg font-semibold">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-lg font-semibold">Subcategory</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
            required
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-lg font-semibold">Price (₹)</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
            type="number"
            placeholder="Enter Price"
            required
          />
        </div>


<div>
  <p className="mb-2 text-lg font-semibold">Extra Amount (₹)</p>
  <input
    type="number"
    value={extraAmount}
    onChange={(e) => setExtraAmount(e.target.value)}
    className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
    placeholder="Enter Extra Amount"
  />
</div>






      </div>

      {/* 🚀 Shipping Details */}
      <div className="mt-4">
        <p className="mb-2 text-lg font-semibold">Shipping Details</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="px-3 py-2 border-gray-500"
            required
          />
          <input
            type="number"
            placeholder="Length (cm)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="px-3 py-2 border-gray-500"
            required
          />
          <input
            type="number"
            placeholder="Breadth (cm)"
            value={breadth}
            onChange={(e) => setBreadth(e.target.value)}
            className="px-3 py-2 border-gray-500"
            required
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="px-3 py-2 border-gray-500"
            required
          />
          <input
            type="number"
            placeholder="Declared Value (₹)"
            value={declaredValue}
            onChange={(e) => setDeclaredValue(e.target.value)}
            className="px-3 py-2 border-gray-500"
            required
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-3 py-2 border-gray-500"
          >
            <option value="Surface">Surface</option>
            <option value="Air">Air</option>
          </select>
        </div>
        <div className="flex items-center mt-2">
          <label className="mr-2">COD (1 for yes / 0 for no):</label>
          <input
            type="number"
            value={cod}
            onChange={(e) => setCod(e.target.value)}
            className="w-20 px-2 py-1 border-gray-500"
            min="0"
            max="1"
          />
        </div>
      </div>

      {/* ✨ Product Type Selection */}
      <div className="w-full mt-4">
        <p className="mb-2 text-lg font-semibold">Product Type</p>
        <select
          onChange={handleProductTypeChange}
          value={selectedProductType}
          className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
          required
        >
          <option value="">Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type._id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✨ Dynamic Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <p className="mb-2 text-lg font-semibold">Available Sizes</p>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <p
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size]
                  )
                }
                className={`${
                  sizes.includes(size)
                    ? "bg-gray-500 text-white rounded-md"
                    : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Best Seller */}
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestSeller"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
        />
        <label htmlFor="bestSeller" className="ml-2 cursor-pointer">
          Add to Best Seller
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <button
          type="submit"
          className="px-5 py-2 mt-2 text-white rounded-lg bg-slate-700"
        >
          Add Product
        </button>
        <button
          type="button"
          className="px-5 py-2 mt-2 text-white rounded-lg bg-slate-700"
          onClick={resetForm}
        >
          Reset Details
        </button>
      </div>
    </form>
  );
};

export default Add;