import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="container">
      <h1 className="title">Welcome to Chef Companion, your personal recipe generator!</h1>
      <p className="description">Generate recipes based on what you have from your pantry and kitchen!</p>
      <button className="button">Get Started</button>
    </div>
  );
}

export default HomePage;