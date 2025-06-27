// SuccessAnimation.js
import React from 'react';
import './SuccessAnimation.css';

const SuccessAnimation = ({ wheels }) => {
  return (
    <div className="animation-container">
      {wheels === '4' ? (
        <div className="car">🚗</div>
      ) : (
        <div className="bike">🏍️</div>
      )}
      <p className="success-text">
        {wheels === '4' ? 'Car Booked Successfully!' : 'Bike Booked Successfully!'}
      </p>
    </div>
  );
};

export default SuccessAnimation;
