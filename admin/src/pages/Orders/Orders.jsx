import React, { useEffect, useState, useContext } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import * as XLSX from 'xlsx';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ratings, setRatings] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');
  const { token } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { token }
      });
      if (response.data.success) {
        const reversedOrders = response.data.data.reverse();
        setOrders(reversedOrders);
        setFilteredOrders(reversedOrders);
        await fetchRatings(reversedOrders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRatings = async (orders) => {
    const ratingsData = {};
    try {
      for (let order of orders) {
        if (order.orderId) {
          const rating = await getRatingByOrderID(order.orderId);
          ratingsData[order.orderId] = rating;
        }
      }
      setRatings(ratingsData);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const getRatingByOrderID = async (orderId) => {
    if (!orderId || !token) return 0;
    try {
      const response = await axios.post(`${url}/api/order/get_feedback`, { orderId }, { 
        headers: { token } 
      });
      return response.data?.feedback?.rating || 0;
    } catch (error) {
      console.error(`Error fetching rating for order ${orderId}:`, error);
      return 0;
    }
  };

  const renderStars = (rating) => {
    if (rating === undefined || rating === null) return "NA";
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = totalStars - filledStars - halfStar;
    
    return (
      <>
        {'★'.repeat(filledStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      }, { headers: { token } });
      
      if (response.data.success) {
        toast.success("Status updated successfully");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const handleStatusFilter = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    
    if (selectedStatus === 'All') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === selectedStatus);
      setFilteredOrders(filtered);
    }
  };

  const downloadExcelReport = () => {
    try {
      const data = filteredOrders.map(order => ({
        'Order ID': order.orderId || 'N/A',
        'Customer Name': `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim() || 'N/A',
        'Items': order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ') || 'N/A',
        'Address': [
          order.address?.street,
          order.address?.city,
          order.address?.state,
          order.address?.country,
          order.address?.zipcode
        ].filter(Boolean).join(', ') || 'N/A',
        'Phone': order.address?.phone || 'N/A',
        'Amount': `${currency}${order.amount || 0}`,
        'Status': order.status || 'N/A',
        'Rating': ratings[order.orderId] !== undefined ? ratings[order.orderId] : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Orders_Report_${date}.xlsx`);
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading orders..</div>;
  }

  return (
    <div className='order add'>
      <div className="order-header">
        <h3>Order Page</h3>
        <div className="order-controls">
          <select 
            value={statusFilter} 
            onChange={handleStatusFilter}
            className="status-filter"
          >
            <option value="All">All Orders</option>
            <option value="Food Processing">Food Processing</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button 
            onClick={downloadExcelReport}
            className="download-btn"
            disabled={filteredOrders.length === 0}
          >
            Download Report (Excel)
          </button>
        </div>
      </div>
      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="parcel icon" />
              <div>
                <p className='order-item-food'>
                  {order.items?.map((item, index) => (
                    index === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  ))}
                </p>
                <p className='order-item-name'>
                  {`${order.address?.firstName || ''} ${order.address?.lastName || ''}`}
                </p>
                <div className='order-item-address'>
                  <p>{order.address?.street || 'N/A'},</p>
                  <p>
                    {[
                      order.address?.city,
                      order.address?.state,
                      order.address?.country,
                      order.address?.zipcode
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
                <p className='order-item-phone'>Phone: {order.address?.phone || 'N/A'}</p>
                <p className='order-item-phone'>Order ID: {order.orderId || 'N/A'}</p>
                <p className='order-item-rating'>
                  Rating: {ratings[order.orderId] !== undefined ? renderStars(ratings[order.orderId]) : "NA"}
                </p>
              </div>
              <p>Items: {order.items?.length || 0}</p>
              <p>{currency}{order.amount || 0}</p>
              <select 
                onChange={(e) => statusHandler(e, order._id)} 
                value={order.status}
                disabled={order.status === 'Delivered'}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        ) : (
          <p className="no-orders">No orders found{statusFilter !== 'All' ? ` with status "${statusFilter}"` : ''}.</p>
        )}
      </div>
    </div>
  );
};

export default Order;