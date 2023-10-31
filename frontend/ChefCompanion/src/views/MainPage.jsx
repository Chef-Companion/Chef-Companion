import React from 'react';
import './MainPage.css'; 
import UniqueIngredients from '../components/UniqueIngredients';


function MainPage() {
  return (
    <div className="main-container">
      <div className="tab left-tab">
        <h2>Recipes</h2>
        <div className="scrollable-content">
          {"recipes"}
        </div>
      </div>
      <div className="tab right-tab">
        <h2>Ingredients</h2>
        <UniqueIngredients />
      </div>
    </div>
  );
}

export default MainPage;
