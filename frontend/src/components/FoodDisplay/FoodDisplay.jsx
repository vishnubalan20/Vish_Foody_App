import React, { useContext, useState, useEffect } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const FoodDisplay = ({ category, productType }) => {
  const { food_list, token } = useContext(StoreContext);
  const [ratings, setRatings] = useState({});

  // Function to fetch the rating for a specific food item
  const fetchRating = async (name) => {
    try {
      const foodData = { name };
      const response = await axios.post(
        'http://localhost:4000/api/order/getratingforfood',
        foodData,
        { headers: { token } }
      );

      // Log the response to check if it's coming in correctly
      console.log('Rating response:', response);

      if (response.data && response.data.rating !== undefined) {
        return response.data.rating;
      } else {
        return 0; // Return 0 if rating is missing
      }
    } catch (error) {
      console.error('Error fetching rating:', error); // Log the error
      return 0; // Return 0 if there's an error fetching data
    }
  };

  // Fetch ratings for all food items when the component mounts
  useEffect(() => {
    const fetchRatingsForAllFood = async () => {
      const ratingMap = {};
      for (const item of food_list) {
        const rating = await fetchRating(item.name);
        ratingMap[item.name] = rating;
      }
      setRatings(ratingMap);
    };

    fetchRatingsForAllFood();
  }, [food_list, token]);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {food_list
          .filter((item) => category === item.category && productType === item.productType)
          .map((item) => {
            const rating = ratings[item.name] || 0; // Get the rating or fallback to 0
            return (
              <FoodItem
                key={item._id}
                image={item.image}
                name={item.name}
                desc={item.description}
                price={item.price}
                rating={rating} // Pass rating as a prop to FoodItem
                id={item._id}
              />
            );
          })}
      </div>
    </div>
  );
};

export default FoodDisplay;
