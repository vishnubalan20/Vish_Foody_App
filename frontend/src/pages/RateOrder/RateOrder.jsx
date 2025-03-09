import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import './RateOrder.css';

const RateOrder = () => {
  const { orderId } = useParams();
  const { url, token, foodName } = useContext(StoreContext);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const submitFeedback = async () => {
    debugger;
      const feedbackData = {
        orderId,
        rating,
        feedback,
        foodName
      };
    let response = await axios.post("http://localhost:4000/api/order/feedback", feedbackData, { headers: { token } }).then((responseData)=>{
      console.log("response", responseData);
       if (responseData.data.message === "success") {
        navigate("/myorders")
        // toast.success(response.data.message)
        console.log("success");
    }
    else {
        // toast.error("Something Went Wrong")
        console.log("error");
    }
    });
   
  };

  return (
    <div className='rate-order-container'>
      <h2>Rate Your Order</h2>
      <div className='rating-stars'>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${rating >= star ? 'filled' : ''}`}
            onClick={() => setRating(star)}
          >
            ⭐
          </span>
        ))}
      </div>
      <textarea
        className='feedback-textarea'
        placeholder='Leave your feedback...'
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>
      <button className='submit-feedback-btn' onClick={submitFeedback}>
        Submit Feedback
      </button>
    </div>
  );
};

export default RateOrder;