import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency, foodName, setFoodName } = useContext(StoreContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    setData(response.data.data);
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Function to generate a unique Order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-5);
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD${timestamp}${randomString}`;
  }


  const getFoodName =(order)=>{
    return order.items.length > 0 ? order.items[0].name : '';
  }
  // Redirect to feedback page
  const handleRateOrder = (orderId, order) => {
    const foodName = getFoodName(order);
    console.log("food name", foodName);
    setFoodName(foodName);
    navigate(`/rate-order/${orderId}`);
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="" />
            
            <div className="order-id">
              <p className="order-id-label">Order No:</p>
              <p className="order-id-value">{order.orderId}</p>
            </div>
            
            <p>{order.items.map((item, index) => (
              index === order.items.length - 1 ? item.name + " x " + item.quantity : item.name + " x " + item.quantity + ", "
            ))}</p>
            <p>{currency}{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
            
            {/* Rate Order Button */}
            {order.status == "Delivered" && (
              <button className="rate-order-btn" onClick={() => handleRateOrder(order.orderId, order)}>Rate Order</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders;
