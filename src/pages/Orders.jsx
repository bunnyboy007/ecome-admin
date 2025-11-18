import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';


const Orders = ({ token}) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [shippingId, setShippingId] = useState('');
  const [savingShippingId, setSavingShippingId] = useState(false);

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentOptions = ['All', 'cod', 'stripe', 'razorpay'];

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/all`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Apply filters
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'All') {
      filtered = filtered.filter(order => order.paymentMethod === paymentFilter);
    }

    if (dateFilter !== 'All') {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      
      filtered = filtered.filter(order => {
        const orderAge = now - order.date;
        switch(dateFilter) {
          case 'Today':
            return orderAge < dayMs;
          case 'Last 7 Days':
            return orderAge < 7 * dayMs;
          case 'Last 30 Days':
            return orderAge < 30 * dayMs;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${order.deliveryInfo.firstName} ${order.deliveryInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, paymentFilter, dateFilter, searchQuery, orders]);

  // Open order details modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setShippingId(order.shippingId || '');
    setShowModal(true);
  };

  // Save shipping ID and auto-sync status from Shiprocket
  const saveShippingId = async () => {
    if (!shippingId.trim()) {
      toast.error('Please enter a shipping ID');
      return;
    }

    try {
      setSavingShippingId(true);
      
      const response = await axios.put(
        `${backendUrl}/api/order/shipping/${selectedOrder._id}`,
        { shippingId: shippingId.trim() },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Shipping ID saved and status synced!');
        fetchOrders(); // Refresh to get updated data
        setShowModal(false);
      } else {
        toast.error(response.data.message || 'Failed to save shipping ID');
      }
    } catch (error) {
      console.error('Error saving shipping ID:', error);
      toast.error(error.response?.data?.message || 'Failed to save shipping ID');
    } finally {
      setSavingShippingId(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('All');
    setPaymentFilter('All');
    setDateFilter('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [statusFilter, paymentFilter, dateFilter].filter(f => f !== 'All').length + (searchQuery ? 1 : 0);

  return (
    <div className='p-4 sm:p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Order Management</h1>
        <p className='text-gray-600'>Manage and track all customer orders</p>
      </div>

      {/* Filters Section */}
      <div className='p-6 mb-6 bg-white border rounded-lg shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Filters</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Search */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Search</label>
            <input
              type="text"
              placeholder="Order ID, Email, Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Payment Method</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {paymentOptions.map(payment => (
                <option key={payment} value={payment}>
                  {payment === 'All' ? 'All' : payment.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-5'>
        <div className='p-4 bg-white border rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Total Orders</p>
          <p className='text-2xl font-bold'>{filteredOrders.length}</p>
        </div>
        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <p className='text-sm text-yellow-700'>Pending</p>
          <p className='text-2xl font-bold text-yellow-800'>
            {filteredOrders.filter(o => o.status === 'Pending').length}
          </p>
        </div>
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-700'>Processing</p>
          <p className='text-2xl font-bold text-blue-800'>
            {filteredOrders.filter(o => o.status === 'Processing').length}
          </p>
        </div>
        <div className='p-4 bg-purple-50 border border-purple-200 rounded-lg'>
          <p className='text-sm text-purple-700'>Shipped</p>
          <p className='text-2xl font-bold text-purple-800'>
            {filteredOrders.filter(o => o.status === 'Shipped').length}
          </p>
        </div>
        <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
          <p className='text-sm text-green-700'>Delivered</p>
          <p className='text-2xl font-bold text-green-800'>
            {filteredOrders.filter(o => o.status === 'Delivered').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className='overflow-hidden bg-white border rounded-lg shadow-sm'>
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='w-12 h-12 border-b-2 border-gray-900 rounded-full animate-spin'></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className='py-20 text-center'>
            <p className='text-lg text-gray-500'>No orders found</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Order ID</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Customer</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Date</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Items</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Amount</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Payment</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Status</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Shipping</th>
                  <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                      #{order._id.slice(-8)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                      </div>
                      <div className='text-sm text-gray-500'>{order.deliveryInfo.email}</div>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {order.items.length} item(s)
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-xs font-semibold uppercase'>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap'>
                      {order.shippingId ? (
                        <span className='text-green-600 font-medium'>✓ {order.shippingId.slice(0, 10)}...</span>
                      ) : (
                        <span className='text-gray-400'>Not added</span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap'>
                      <button
                        onClick={() => openModal(order)}
                        className='px-4 py-1.5 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium'
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='w-full max-w-4xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold'>Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Order Info */}
            <div className='p-4 mb-6 border rounded-lg bg-blue-50'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Order ID</p>
                  <p className='font-semibold text-blue-900'>#{selectedOrder._id}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Order Date</p>
                  <p className='font-medium'>
                    {new Date(selectedOrder.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Payment Method</p>
                  <p className='font-medium uppercase'>{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total Amount</p>
                  <p className='text-lg font-bold text-blue-900'>₹{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Current Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Subtotal</p>
                  <p className='font-medium'>₹{selectedOrder.subTotal?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Delivery Charge</p>
                  <p className='font-medium'>₹{selectedOrder.deliveryCharge?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className='p-4 mb-6 border rounded-lg bg-gray-50'>
              <h3 className='mb-3 text-lg font-semibold'>Customer Information</h3>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-600'>Name</p>
                  <p className='font-medium'>{selectedOrder.deliveryInfo.firstName} {selectedOrder.deliveryInfo.lastName}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Email</p>
                  <p className='font-medium'>{selectedOrder.deliveryInfo.email}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Mobile</p>
                  <p className='font-medium'>{selectedOrder.deliveryInfo.mobile}</p>
                </div>
                <div>
                  <p className='text-gray-600'>ZIP Code</p>
                  <p className='font-medium'>{selectedOrder.deliveryInfo.zipCode}</p>
                </div>
                <div className='col-span-2'>
                  <p className='text-gray-600'>Address</p>
                  <p className='font-medium'>{selectedOrder.deliveryInfo.street}, {selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.state} - {selectedOrder.deliveryInfo.zipCode}, {selectedOrder.deliveryInfo.country}</p>
                </div>
              </div>
            </div>



{/* Box Recommendation & Packing Details */}
            {selectedOrder.boxRecommendation && (
              <div className='p-5 mb-6 border-2 border-orange-300 rounded-lg bg-orange-50'>
                <h3 className='mb-4 text-xl font-bold text-orange-900 flex items-center gap-2'>
                  📦 Box Recommendation & Packing Details
                </h3>
                
                {/* Recommended Box */}
                {selectedOrder.boxRecommendation.recommendedBox && (
                  <div className='p-4 mb-4 bg-white border border-orange-200 rounded-lg'>
                    <h4 className='mb-3 text-lg font-semibold text-orange-800'>✅ Recommended Box</h4>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p className='font-medium text-gray-600'>Box Name</p>
                        <p className='text-lg font-bold text-orange-900'>
                          {selectedOrder.boxRecommendation.recommendedBox.name}
                        </p>
                      </div>
                      <div>
                        <p className='font-medium text-gray-600'>Max Weight Capacity</p>
                        <p className='text-lg font-bold text-orange-900'>
                          {selectedOrder.boxRecommendation.recommendedBox.maxWeight} kg
                        </p>
                      </div>
                      <div className='col-span-2'>
                        <p className='font-medium text-gray-600 mb-2'>Box Dimensions (L × B × H)</p>
                        <div className='flex gap-4 items-center bg-orange-100 p-3 rounded-lg'>
                          <div className='text-center'>
                            <p className='text-xs text-gray-600'>Length</p>
                            <p className='text-xl font-bold text-orange-900'>
                              {selectedOrder.boxRecommendation.recommendedBox.dimensions?.length || 0} cm
                            </p>
                          </div>
                          <span className='text-2xl text-orange-600'>×</span>
                          <div className='text-center'>
                            <p className='text-xs text-gray-600'>Breadth</p>
                            <p className='text-xl font-bold text-orange-900'>
                              {selectedOrder.boxRecommendation.recommendedBox.dimensions?.breadth || 0} cm
                            </p>
                          </div>
                          <span className='text-2xl text-orange-600'>×</span>
                          <div className='text-center'>
                            <p className='text-xs text-gray-600'>Height</p>
                            <p className='text-xl font-bold text-orange-900'>
                              {selectedOrder.boxRecommendation.recommendedBox.dimensions?.height || 0} cm
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculated Package Details */}
                <div className='p-4 mb-4 bg-white border border-orange-200 rounded-lg'>
                  <h4 className='mb-3 text-lg font-semibold text-orange-800'>📊 Package Details</h4>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='p-3 bg-orange-50 rounded-lg text-center'>
                      <p className='text-xs text-gray-600 mb-1'>Total Weight</p>
                      <p className='text-2xl font-bold text-orange-900'>
                        {selectedOrder.boxRecommendation.totalWeight || 0} kg
                      </p>
                    </div>
                    <div className='p-3 bg-orange-50 rounded-lg text-center'>
                      <p className='text-xs text-gray-600 mb-1'>Total Volume</p>
                      <p className='text-2xl font-bold text-orange-900'>
                        {selectedOrder.boxRecommendation.totalVolume || 0} cm³
                      </p>
                    </div>
                    <div className='p-3 bg-orange-50 rounded-lg text-center'>
                      <p className='text-xs text-gray-600 mb-1'>Packing Efficiency</p>
                      <p className='text-2xl font-bold text-orange-900'>
                        {selectedOrder.boxRecommendation.packingEfficiency?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <div className='p-3 bg-orange-50 rounded-lg text-center'>
                      <p className='text-xs text-gray-600 mb-1'>Items Count</p>
                      <p className='text-2xl font-bold text-orange-900'>
                        {selectedOrder.boxRecommendation.itemsList?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Calculated Dimensions */}
                  {selectedOrder.boxRecommendation.calculatedDimensions && (
                    <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
                      <p className='text-sm font-medium text-gray-700 mb-2'>Calculated Package Dimensions:</p>
                      <div className='flex gap-3 items-center justify-center'>
                        <span className='px-3 py-1 bg-white border border-gray-300 rounded font-semibold'>
                          L: {selectedOrder.boxRecommendation.calculatedDimensions.length} cm
                        </span>
                        <span className='text-gray-400'>×</span>
                        <span className='px-3 py-1 bg-white border border-gray-300 rounded font-semibold'>
                          B: {selectedOrder.boxRecommendation.calculatedDimensions.breadth} cm
                        </span>
                        <span className='text-gray-400'>×</span>
                        <span className='px-3 py-1 bg-white border border-gray-300 rounded font-semibold'>
                          H: {selectedOrder.boxRecommendation.calculatedDimensions.height} cm
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List with Dimensions */}
                {selectedOrder.boxRecommendation.itemsList && selectedOrder.boxRecommendation.itemsList.length > 0 && (
                  <div className='p-4 bg-white border border-orange-200 rounded-lg'>
                    <h4 className='mb-3 text-lg font-semibold text-orange-800'>📋 Items Breakdown</h4>
                    <div className='space-y-3'>
                      {selectedOrder.boxRecommendation.itemsList.map((item, idx) => (
                        <div key={idx} className='p-3 bg-orange-50 border border-orange-200 rounded-lg'>
                          <div className='flex justify-between items-start mb-2'>
                            <div>
                              <p className='font-semibold text-gray-900'>{item.name || 'Product'}</p>
                              <p className='text-sm text-gray-600'>Size: {item.size} | Quantity: {item.quantity}</p>
                            </div>
                            <div className='text-right'>
                              <p className='text-sm font-medium text-gray-600'>Weight</p>
                              <p className='text-lg font-bold text-orange-900'>{item.totalWeight || 0} kg</p>
                            </div>
                          </div>
                          
                          {item.dimensions && (
                            <div className='grid grid-cols-4 gap-2 mt-2 text-xs'>
                              <div className='p-2 bg-white rounded text-center'>
                                <p className='text-gray-600'>Length</p>
                                <p className='font-bold'>{item.dimensions.length} cm</p>
                              </div>
                              <div className='p-2 bg-white rounded text-center'>
                                <p className='text-gray-600'>Breadth</p>
                                <p className='font-bold'>{item.dimensions.breadth} cm</p>
                              </div>
                              <div className='p-2 bg-white rounded text-center'>
                                <p className='text-gray-600'>Height</p>
                                <p className='font-bold'>{item.dimensions.height} cm</p>
                              </div>
                              <div className='p-2 bg-white rounded text-center'>
                                <p className='text-gray-600'>Volume</p>
                                <p className='font-bold'>{item.totalVolume || 0} cm³</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shiprocket Information (if already placed) */}
            {(selectedOrder.shippingId || selectedOrder.courierName || selectedOrder.trackingUrl) && (
              <div className='p-4 mb-6 border border-purple-200 rounded-lg bg-purple-50'>
                <h3 className='mb-3 text-lg font-semibold text-purple-900'>📦 Shipping Information</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  {selectedOrder.shippingId && (
                    <div>
                      <p className='font-medium text-purple-700'>Tracking ID (AWB)</p>
                      <p className='font-mono text-lg font-bold text-purple-900'>{selectedOrder.shippingId}</p>
                    </div>
                  )}
                  {selectedOrder.courierName && (
                    <div>
                      <p className='font-medium text-purple-700'>Courier Partner</p>
                      <p className='font-semibold text-purple-900'>{selectedOrder.courierName}</p>
                    </div>
                  )}
                  {selectedOrder.courierId && (
                    <div>
                      <p className='font-medium text-purple-700'>Courier ID</p>
                      <p className='font-mono text-purple-900'>{selectedOrder.courierId}</p>
                    </div>
                  )}
                  {selectedOrder.estimatedDelivery && (
                    <div>
                      <p className='font-medium text-purple-700'>Estimated Delivery</p>
                      <p className='font-semibold text-purple-900'>{selectedOrder.estimatedDelivery}</p>
                    </div>
                  )}
                  {selectedOrder.trackingUrl && (
                    <div className='col-span-2'>
                      <p className='font-medium text-purple-700'>Track Shipment</p>
                      <a 
                        href={selectedOrder.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='text-blue-600 underline hover:text-blue-800 font-medium break-all'
                      >
                        {selectedOrder.trackingUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}











            {/* Shiprocket Information (if already placed) */}
            {/* {(selectedOrder.shippingId || selectedOrder.courierName || selectedOrder.trackingUrl) && (
              <div className='p-4 mb-6 border border-purple-200 rounded-lg bg-purple-50'>
                <h3 className='mb-3 text-lg font-semibold text-purple-900'>📦 Shipping Information</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  {selectedOrder.shippingId && (
                    <div>
                      <p className='font-medium text-purple-700'>Tracking ID (AWB)</p>
                      <p className='font-mono text-lg font-bold text-purple-900'>{selectedOrder.shippingId}</p>
                    </div>
                  )}
                  {selectedOrder.courierName && (
                    <div>
                      <p className='font-medium text-purple-700'>Courier Partner</p>
                      <p className='font-semibold text-purple-900'>{selectedOrder.courierName}</p>
                    </div>
                  )}
                  {selectedOrder.courierId && (
                    <div>
                      <p className='font-medium text-purple-700'>Courier ID</p>
                      <p className='font-mono text-purple-900'>{selectedOrder.courierId}</p>
                    </div>
                  )}
                  {selectedOrder.estimatedDelivery && (
                    <div>
                      <p className='font-medium text-purple-700'>Estimated Delivery</p>
                      <p className='font-semibold text-purple-900'>{selectedOrder.estimatedDelivery}</p>
                    </div>
                  )}
                  {selectedOrder.trackingUrl && (
                    <div className='col-span-2'>
                      <p className='font-medium text-purple-700'>Track Shipment</p>
                      <a 
                        href={selectedOrder.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='text-blue-600 underline hover:text-blue-800 font-medium break-all'
                      >
                        {selectedOrder.trackingUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )} */}

            {/* Order Items */}
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-semibold'>Order Items</h3>
              <div className='space-y-3'>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50'>
                    <div className='flex items-center gap-4'>
                      {item.productId?.image?.[0] && (
                        <img 
                          src={item.productId.image[0]} 
                          alt={item.productId.name}
                          className='object-cover w-16 h-16 border rounded'
                        />
                      )}
                      <div>
                        <p className='font-medium'>{item.productId?.name || 'Product'}</p>
                        <p className='text-sm text-gray-600'>Size: {item.size} | Qty: {item.quantity}</p>
                        <p className='text-xs text-gray-500'>₹{item.price} × {item.quantity}</p>
                      </div>
                    </div>
                    <p className='font-semibold text-gray-900'>₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className='pt-4 mt-4 space-y-2 border-t'>
                <div className='flex justify-between text-sm'>
                  <p>Subtotal</p>
                  <p className='font-medium'>₹{selectedOrder.subTotal?.toLocaleString() || 0}</p>
                </div>
                <div className='flex justify-between text-sm'>
                  <p>Delivery Charge</p>
                  <p className='font-medium'>₹{selectedOrder.deliveryCharge?.toLocaleString() || 0}</p>
                </div>
                <div className='flex justify-between pt-2 border-t'>
                  <p className='text-lg font-semibold'>Total Amount</p>
                  <p className='text-lg font-bold text-blue-900'>₹{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 🔥 ADD/UPDATE TRACKING ID SECTION */}
            <div className='p-4 border-l-4 border-green-500 bg-green-50'>
              <h3 className='mb-2 text-lg font-semibold text-green-900'>
                {selectedOrder.shippingId ? '📝 Update Tracking ID' : '➕ Add Tracking ID'}
              </h3>
              <p className='mb-4 text-sm text-green-800'>
                Enter the AWB/Tracking ID from your courier service. The system will automatically sync the shipment status.
              </p>
              
              <div className='flex gap-3'>
                <input
                  type="text"
                  value={shippingId}
                  onChange={(e) => setShippingId(e.target.value)}
                  placeholder='Enter AWB / Tracking ID'
                  className='flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
                <button
                  onClick={saveShippingId}
                  disabled={savingShippingId || !shippingId.trim()}
                  className='px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]'
                >
                  {savingShippingId ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>💾 Save & Sync</span>
                  )}
                </button>
              </div>
              
              {selectedOrder.shippingId && (
                <p className='mt-3 text-sm text-green-700'>
                  <strong>Current Tracking ID:</strong> <span className='font-mono font-bold'>{selectedOrder.shippingId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;