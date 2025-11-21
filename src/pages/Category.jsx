// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [subCategoryName, setSubCategoryName] = useState("");

//   // Fetch all categories and subcategories
//   const fetchData = async () => {
//     try {
//       const [catRes, subRes] = await Promise.all([
//         axios.get(`${backendUrl}/api/product/categories`),
//         axios.get(`${backendUrl}/api/product/subcategories`),
//       ]);
//       setCategories(catRes.data.data);
//       setSubCategories(subRes.data.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch data");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Add new category
//   const handleAddCategory = async () => {
//     if (!categoryName.trim()) return toast.warn("Enter category name");
//     try {
//       const res = await axios.post(`${backendUrl}/api/product/add-category`, {
//         name: categoryName,
//       });
//       toast.success(res.data.message);
//       setCategoryName("");
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error adding category");
//     }
//   };

//   // Add new subcategory
//   const handleAddSubCategory = async () => {
//     if (!subCategoryName.trim()) return toast.warn("Enter subcategory name");
//     try {
//       const res = await axios.post(`${backendUrl}/api/product/add-subcategory`, {
//         name: subCategoryName,
//       });
//       toast.success(res.data.message);
//       setSubCategoryName("");
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error adding subcategory");
//     }
//   };

//   // Delete category
//   const handleDeleteCategory = async (id) => {
//     if (!window.confirm("Delete this category?")) return;
//     try {
//       await axios.delete(`${backendUrl}/api/product/category/${id}`);
//       toast.success("Category deleted");
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to delete category");
//     }
//   };

//   // Delete subcategory
//   const handleDeleteSubCategory = async (id) => {
//     if (!window.confirm("Delete this subcategory?")) return;
//     try {
//       await axios.delete(`${backendUrl}/api/product/subcategory/${id}`);
//       toast.success("Subcategory deleted");
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to delete subcategory");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Manage Categories & Subcategories</h2>

//       {/* Add Category */}
//       <div className="mb-6 border p-4 rounded">
//         <h3 className="text-lg font-medium mb-2">Add New Category</h3>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             placeholder="Category name"
//             className="border p-2 rounded w-full"
//           />
//           <button
//             onClick={handleAddCategory}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Add Subcategory */}
//       <div className="mb-6 border p-4 rounded">
//         <h3 className="text-lg font-medium mb-2">Add New Subcategory</h3>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={subCategoryName}
//             onChange={(e) => setSubCategoryName(e.target.value)}
//             placeholder="Subcategory name"
//             className="border p-2 rounded w-full"
//           />
//           <button
//             onClick={handleAddSubCategory}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Category List */}
//       <div className="mb-6 border p-4 rounded">
//         <h3 className="text-lg font-medium mb-3">All Categories</h3>
//         {categories.length === 0 ? (
//           <p>No categories found</p>
//         ) : (
//           <ul className="space-y-2">
//             {categories.map((cat) => (
//               <li key={cat._id} className="flex justify-between items-center border-b pb-1">
//                 <span>{cat.name}</span>
//                 <button
//                   onClick={() => handleDeleteCategory(cat._id)}
//                   className="text-red-500 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Subcategory List */}
//       <div className="border p-4 rounded">
//         <h3 className="text-lg font-medium mb-3">All Subcategories</h3>
//         {subCategories.length === 0 ? (
//           <p>No subcategories found</p>
//         ) : (
//           <ul className="space-y-2">
//             {subCategories.map((sub) => (
//               <li key={sub._id} className="flex justify-between items-center border-b pb-1">
//                 <span>{sub.name}</span>
//                 <button
//                   onClick={() => handleDeleteSubCategory(sub._id)}
//                   className="text-red-500 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Category;










import React, { useEffect, useState } from "react";
import { 
  FolderPlus, 
  Layers, 
  Trash2, 
  Plus, 
  Tag,
  AlertCircle,
  Check
} from "lucide-react";

// Mock data for preview
const mockCategories = [
  { _id: "1", name: "Men" },
  { _id: "2", name: "Women" },
  { _id: "3", name: "Kids" }
];

const mockSubCategories = [
  { _id: "1", name: "Topwear" },
  { _id: "2", name: "Bottomwear" },
  { _id: "3", name: "Footwear" }
];

const Category = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [subCategories, setSubCategories] = useState(mockSubCategories);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://mern-ecome.onrender.com";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, subRes] = await Promise.all([
        fetch(`${backendUrl}/api/product/categories`),
        fetch(`${backendUrl}/api/product/subcategories`)
      ]);
      
      const catData = await catRes.json();
      const subData = await subRes.json();
      
      setCategories(catData.data || []);
      setSubCategories(subData.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/product/add-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Category added successfully!");
        setCategoryName("");
        fetchData();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddSubCategory = async () => {
    if (!subCategoryName.trim()) {
      alert("Please enter a subcategory name");
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/product/add-subcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subCategoryName })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Subcategory added successfully!");
        setSubCategoryName("");
        fetchData();
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    
    try {
      await fetch(`${backendUrl}/api/product/category/${id}`, {
        method: "DELETE"
      });
      alert("Category deleted");
      fetchData();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!confirm("Delete this subcategory?")) return;
    
    try {
      await fetch(`${backendUrl}/api/product/subcategory/${id}`, {
        method: "DELETE"
      });
      alert("Subcategory deleted");
      fetchData();
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Layers className="w-8 h-8 mr-3 text-blue-600" />
            Category Management
          </h1>
          <p className="text-gray-500 mt-1">Organize your products with categories and subcategories</p>
        </div>

        {/* Add Forms Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Add Category Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-3">
                <FolderPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add Category</h3>
                <p className="text-sm text-gray-500">Create a new product category</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
          </div>

          {/* Add Subcategory Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-3">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add Subcategory</h3>
                <p className="text-sm text-gray-500">Create a new subcategory</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubCategory()}
              />
              <button
                onClick={handleAddSubCategory}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FolderPlus className="w-6 h-6 mr-2" />
                Categories ({categories.length})
              </h3>
            </div>
            <div className="p-6">
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No categories yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first category above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">{cat.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subcategories List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Tag className="w-6 h-6 mr-2" />
                Subcategories ({subCategories.length})
              </h3>
            </div>
            <div className="p-6">
              {subCategories.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No subcategories yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first subcategory above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subCategories.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">{sub.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSubCategory(sub._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete subcategory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Categories</p>
                <p className="text-3xl font-bold mt-1">{categories.length}</p>
              </div>
              <FolderPlus className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Subcategories</p>
                <p className="text-3xl font-bold mt-1">{subCategories.length}</p>
              </div>
              <Tag className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;