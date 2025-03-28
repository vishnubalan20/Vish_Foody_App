import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import TrackOrderMap from '../TrackOrderMap/TrackOrderMap'; // Import the map component

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [showTrackOrder, setShowTrackOrder] = useState(false);
  const [trackButtonName , setTrackButtonName] = useState("Track order");
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

    // Handle track order button click
    const handleTrackOrder = (orderId) => {
      setTrackingOrderId(orderId); // Set the selected order ID to show the map
      if(trackButtonName == "Track order"){
        setTrackButtonName("Hide Track");
        setShowTrackOrder(true);
      }
      else {
        setShowTrackOrder(false);
        setTrackButtonName("Track order");
      }
    };

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
            <div>
            <p>{currency}{order.amount}.00</p>
           {order.amountPaid!=undefined &&  <p>Payment: {order.amountPaid}</p>}
            </div>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
             {/* Track Order Button */}
             {order.status !== 'Delivered' && (
              <button onClick={() => handleTrackOrder(order.orderId)}>{trackButtonName}</button>
            )}
            {/* Rate Order Button */}
            {order.status == "Delivered" && (
              <button className="rate-order-btn" onClick={() => handleRateOrder(order.orderId, order)}>Rate Order</button>
            )}

                 {/* Display the map when the order is being tracked */}
                 {showTrackOrder && trackingOrderId && trackingOrderId === order.orderId && (
              <TrackOrderMap orderId={order.orderId} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders;
