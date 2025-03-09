import React, { useEffect, useState, useContext } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({});  // State to store ratings
  const { token, setToken } = useContext(StoreContext);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if (response.data.success) {
      setOrders(response.data.data.reverse());
      fetchRatings(response.data.data);  // Fetch ratings after orders are fetched
    } else {
      toast.error("Error");
    }
  };

  const fetchRatings = async (orders) => {
    const orderIds = orders.map(order => order.orderId);
    const ratingsData = {};

    for (let orderId of orderIds) {
      const rating = await getRatingByOrderID(orderId);
      ratingsData[orderId] = rating;
    }

    setRatings(ratingsData);  // Store ratings in state
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const emptyStars = totalStars - filledStars;
    
    // Create an array of stars
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push('★');  // Filled star
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');  // Empty star
    }

    return stars.join('');  // Return a string of star characters
  };
  const getRatingByOrderID = async (orderId) => {
    if (orderId) {
      try {
        const orderData = { orderId };
        const response = await axios.post("http://localhost:4000/api/order/get_feedback", orderData, { headers: { token } });

        // Log the response to check if it's coming in correctly
        console.log('Rating response:', response);

        if (response.data && response.data.feedback && response.data.feedback.rating !== undefined) {
          return response.data.feedback.rating;
        } else {
          return 0; // Return 0 if rating is missing
        }
      } catch (error) {
        console.error("Error fetching rating:", error);  // Log the error
        return 0; // Return 0 if there's an error fetching data
      }
    }
    return 0; // Return 0 if no orderId is passed
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);  // Fetch orders and ratings when component mounts

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => (
                  index === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                ))}
              </p>
              <p className='order-item-name'>
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>Phone: {order.address.phone}</p>
              <p className='order-item-phone'>Order ID: {order.orderId}</p>
              <br />
              <p className='order-item-phone'>
                Rating: {ratings[order.orderId] ? renderStars(ratings[order.orderId]) : "NA"}
              </p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
