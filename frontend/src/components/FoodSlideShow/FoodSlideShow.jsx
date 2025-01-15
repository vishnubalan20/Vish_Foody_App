import React from 'react';
import './FoodSlideShow.css'; // Make sure to include the CSS
import foodvideo from './foodvideo.mp4';

const DishVideoGallery = () => {
  return (
    <div className="dish-video-gallery">
      <h1>Discover Our Featured Dishes</h1>
      <p className="dish-video-gallery-text">
        Watch our featured video showcasing our delicious dishes.
      </p>
      <div className="dish-video-gallery-list">
        <div className="dish-video-gallery-list-item">
          {/* Embed YouTube video using iframe */}
          <iframe
            width="400"
            height="300"
            src={foodvideo} // Replace with your YouTube video link
            title="Featured Dish Video"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <p>Featured Dish</p>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default DishVideoGallery;
