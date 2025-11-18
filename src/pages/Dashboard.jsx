import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
    monthRevenue: 0,
    monthOrders: 0
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all necessary data
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${backendUrl}/api/order/all`),
        fetch(`${backendUrl}/api/product/list`)
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      if (ordersData.success && productsData.success) {
        calculateStats(ordersData.orders, productsData.products);
        calculateTopProducts(ordersData.orders, productsData.products);
        setRecentOrders(ordersData.orders.slice(0, 5));
        calculateRevenueData(ordersData.orders);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders, products) => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayRevenue = orders
      .filter(order => new Date(order.date) >= todayStart)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const monthRevenue = orders
      .filter(order => new Date(order.date) >= monthStart)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const todayOrders = orders.filter(order => new Date(order.date) >= todayStart).length;
    const monthOrders = orders.filter(order => new Date(order.date) >= monthStart).length;

    setStats({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: new Set(orders.map(o => o.userId)).size,
      pendingOrders: orders.filter(o => o.status === "Pending").length,
      processingOrders: orders.filter(o => o.status === "Processing").length,
      shippedOrders: orders.filter(o => o.status === "Shipped").length,
      deliveredOrders: orders.filter(o => o.status === "Delivered").length,
      cancelledOrders: orders.filter(o => o.status === "Cancelled").length,
      todayRevenue,
      todayOrders,
      monthRevenue,
      monthOrders
    });
  };

  const calculateTopProducts = (orders, products) => {
    const productSales = {};

    orders.forEach(order => {
      order.items?.forEach(item => {
        const productId = item.productId?._id || item.productId;
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              product: item.productId,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity || 0;
          productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
        }
      });
    });

    const topProductsArray = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopProducts(topProductsArray);
  };

  const calculateRevenueData = (orders) => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= date && orderDate < nextDate;
      });

      const revenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length
      });
    }

    setRevenueData(last7Days);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend.direction === "up" ? (
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={trend.direction === "up" ? "text-green-500" : "text-red-500"}>
            {trend.value}
          </span>
          <span className="text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            subtitle={`₹${stats.monthRevenue.toLocaleString()} this month`}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value={stats.totalOrders}
            subtitle={`${stats.monthOrders} this month`}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Package}
            title="Total Products"
            value={stats.totalProducts}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={Users}
            title="Total Customers"
            value={stats.totalUsers}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Today's Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue</span>
                <span className="font-bold text-xl text-green-600">
                  ₹{stats.todayRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders</span>
                <span className="font-bold text-xl">{stats.todayOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Order Value</span>
                <span className="font-bold text-xl">
                  ₹{stats.todayOrders > 0 
                    ? Math.round(stats.todayRevenue / stats.todayOrders).toLocaleString() 
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-gray-600">Pending</span>
                </div>
                <span className="font-semibold">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-600">Processing</span>
                </div>
                <span className="font-semibold">{stats.processingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-gray-600">Shipped</span>
                </div>
                <span className="font-semibold">{stats.shippedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Delivered</span>
                </div>
                <span className="font-semibold">{stats.deliveredOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-gray-600">Cancelled</span>
                </div>
                <span className="font-semibold">{stats.cancelledOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Last 7 Days Revenue
            </h3>
            <div className="space-y-2">
              {revenueData.map((day, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-gray-600 w-16">{day.date}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max((day.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100, 5)}%`
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {day.orders}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-24 text-right">
                    ₹{day.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Top Selling Products
            </h3>
            <div className="space-y-4">
              {topProducts.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product?.name || "Unknown Product"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      ₹{item.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No sales data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-700">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.userId?.name || order.deliveryInfo?.firstName || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-700">
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No orders found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;