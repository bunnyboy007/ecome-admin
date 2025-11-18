import React, { useEffect, useState } from "react";

const AddSizes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    sizes: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // const API_BASE_URL = "http://localhost:4000/api/product-type";

const API_BASE_URL = "https://mern-ecome.onrender.com/api/product-type";




  // Fetch all product types on component mount
  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      const data = await response.json();
      
      if (data.success) {
        setProductTypes(data.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
      setMessage({ type: "error", text: "Failed to fetch product types" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Convert comma-separated sizes into an array
      const sizesArray = formData.sizes
        .split(",")
        .map(size => size.trim())
        .filter(size => size !== "");

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          sizes: sizesArray
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setFormData({ name: "", sizes: "" });
        fetchProductTypes(); // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create product type" });
      }
    } catch (error) {
      console.error("Error creating product type:", error);
      setMessage({ type: "error", text: "Failed to create product type" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Type Management</h1>

        {/* Create Product Type Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Product Type</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Type Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., T-Shirt, Hoodie, Jeans"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-1">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                id="sizes"
                name="sizes"
                value={formData.sizes}
                onChange={handleInputChange}
                placeholder="e.g., S, M, L, XL, XXL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Separate each size with a comma</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Product Type"}
            </button>
          </form>

          {/* Message Display */}
          {message.text && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === "success" 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Existing Product Types List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Product Types</h2>
          
          {productTypes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No product types found. Create your first one above!</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productTypes.map((type) => (
                <div key={type._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{type.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {type.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSizes;