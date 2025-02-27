import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);

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
    const timestamp = Date.now().toString().slice(-5); // Last 5 digits of the timestamp
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // Random 4-character string
    return `ORD${timestamp}${randomString}`; // Combining both
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          // Generate a unique order number
          const orderNumber = generateOrderId();

          return (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="" />
              
              {/* Styling Order Number to display label on top and value below */}
              <div className="order-id">
                <p className="order-id-label">Order No:</p>
                <p className="order-id-value">{order.orderId}</p> {/* Displaying the generated order number */}
              </div>
              
              <p>{order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity;
                }
                else {
                  return item.name + " x " + item.quantity + ", ";
                }
              })}</p>
              <p>{currency}{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders;
