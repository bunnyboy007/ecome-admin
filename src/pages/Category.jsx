import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  // Fetch all categories and subcategories
  const fetchData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        axios.get(`${backendUrl}/api/product/categories`),
        axios.get(`${backendUrl}/api/product/subcategories`),
      ]);
      setCategories(catRes.data.data);
      setSubCategories(subRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return toast.warn("Enter category name");
    try {
      const res = await axios.post(`${backendUrl}/api/product/add-category`, {
        name: categoryName,
      });
      toast.success(res.data.message);
      setCategoryName("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
    }
  };

  // Add new subcategory
  const handleAddSubCategory = async () => {
    if (!subCategoryName.trim()) return toast.warn("Enter subcategory name");
    try {
      const res = await axios.post(`${backendUrl}/api/product/add-subcategory`, {
        name: subCategoryName,
      });
      toast.success(res.data.message);
      setSubCategoryName("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding subcategory");
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${backendUrl}/api/product/category/${id}`);
      toast.success("Category deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  // Delete subcategory
  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await axios.delete(`${backendUrl}/api/product/subcategory/${id}`);
      toast.success("Subcategory deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Categories & Subcategories</h2>

      {/* Add Category */}
      <div className="mb-6 border p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Add New Category</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Add Subcategory */}
      <div className="mb-6 border p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Add New Subcategory</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            placeholder="Subcategory name"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddSubCategory}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="mb-6 border p-4 rounded">
        <h3 className="text-lg font-medium mb-3">All Categories</h3>
        {categories.length === 0 ? (
          <p>No categories found</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id} className="flex justify-between items-center border-b pb-1">
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subcategory List */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-medium mb-3">All Subcategories</h3>
        {subCategories.length === 0 ? (
          <p>No subcategories found</p>
        ) : (
          <ul className="space-y-2">
            {subCategories.map((sub) => (
              <li key={sub._id} className="flex justify-between items-center border-b pb-1">
                <span>{sub.name}</span>
                <button
                  onClick={() => handleDeleteSubCategory(sub._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Category;
