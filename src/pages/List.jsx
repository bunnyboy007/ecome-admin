// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { backendUrl, currency } from "../App";
// import { toast } from "react-toastify";

// const List = ({ token }) => {
//   const [listProducts, setListProducts] = useState([]);

//   const fetchListProducts = async () => {
//     try {
//       const response = await axios.get(backendUrl + "/api/product/list");
// console.log("this is the response", response);

//       if (response.data.success) {
//         setListProducts(response.data.products);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(response.data.message);
//     }
//   };

//   const removeProduct = async (id) => {
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/product/remove",
//         { id },
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.info(response.data.message);
//         await fetchListProducts();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(response.data.message);
//     }
//   };

//   useEffect(() => {
//     fetchListProducts();
//   }, []);

//   return (
//     <>
//       <div className="flex flex-col gap-2">
//         {/* List Table Title */}
//         <div className="hidden md:grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.2fr] items-center py-1 px-2 border bg-gray-200 text-xl text-center">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Description</b>
//           <b>Category</b>
//           <b>Sub Category</b>
//           <b>Price</b>
//           <b className="text-center">Action</b>
//         </div>
//         {/* Display Products */}
//         {listProducts.map((item, index) => (
//           <div
//             className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.2fr] md:grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.2fr] items-center gap-2 py-1 px-2 border text-sm text-center"
//             key={index}
//           >
//             <img className="w-12" src={item.image[0]} alt="Product Image" />
//             <p className="text-left">{item.name}</p>
//             <p className="text-left">{item.description}</p>
//             <p>{item.category}</p>
//             <p>{item.subCategory}</p>
//             <p>{currency(item.price)}</p>
//             <p
//               onClick={() => removeProduct(item._id)}
//               className="font-bold text-center text-gray-800 bg-red-500 rounded-full cursor-pointer md:text-center max-w-7"
//             >
//               X
//             </p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default List;








import React, { useEffect, useState } from "react";
import { 
  Package, Trash2, Search, Filter, X, Eye, ChevronDown, ChevronUp,
  Tag, TrendingUp, Layers, DollarSign, Ruler, Weight, Box, Truck
} from "lucide-react";

// Mock data for preview - replace with actual props
const mockProducts = [
  {
    _id: "1",
    name: "Premium Cotton T-Shirt",
    description: "High quality 100% cotton t-shirt with premium finish and comfortable fit",
    price: 599,
    category: "Men",
    subCategory: "Topwear",
    image: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    bestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    weight: 0.2,
    cod: true,
    length: 30,
    breadth: 25,
    height: 2,
    mode: "Surface",
    declared_value: 599,
    extraAmount: 0,
    date: new Date()
  }
];

const List = ({ token }) => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://mern-ecome.onrender.com";

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/product/list`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    
    try {
      const response = await fetch(`${backendUrl}/api/product/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ id })
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];

  // Product Detail Modal
  const ProductModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Product Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {product.image?.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full h-40 object-cover rounded-lg border" />
            ))}
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-2xl mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {product.subCategory}
                </span>
                {product.bestSeller && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> Best Seller
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="flex items-center text-gray-700">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Price
                </span>
                <span className="font-bold text-xl text-green-600">₹{product.price}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="flex items-center text-gray-700">
                  <Layers className="w-5 h-5 mr-2 text-blue-600" /> Sizes
                </span>
                <div className="flex gap-2">
                  {product.sizes?.map((size, i) => (
                    <span key={i} className="px-2 py-1 bg-white border rounded text-sm">{size}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold mb-3 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" /> Shipping Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <Weight className="w-4 h-4 mr-2" /> Weight
                </span>
                <span className="font-semibold">{product.weight} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <Box className="w-4 h-4 mr-2" /> Dimensions
                </span>
                <span className="font-semibold">{product.length} × {product.breadth} × {product.height} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mode</span>
                <span className="font-semibold">{product.mode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">COD</span>
                <span className={`font-semibold ${product.cod ? 'text-green-600' : 'text-red-600'}`}>
                  {product.cod ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Declared Value</span>
                <span className="font-semibold">₹{product.declared_value}</span>
              </div>
              {product.extraAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Extra Amount</span>
                  <span className="font-semibold">₹{product.extraAmount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => deleteProduct(product._id)}
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <Package className="w-8 h-8 mr-3 text-blue-600" />
            Products ({filteredProducts.length})
          </h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 flex gap-4">
                {/* Image */}
                <img 
                  src={product.image[0]} 
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                      {product.bestSeller && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full inline-flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" /> Best Seller
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{product.category}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">{product.subCategory}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                      <Weight className="w-3 h-3 mr-1" /> {product.weight}kg
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                      <Box className="w-3 h-3 mr-1" /> {product.length}×{product.breadth}×{product.height}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${product.cod ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      COD: {product.cod ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default List;