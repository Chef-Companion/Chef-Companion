import React, { useState } from 'react';
import './MainPage.css';

function MainPage() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setIngredients([...ingredients, { name: newIngredient, checked: false }]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredients = () => {
    const filteredIngredients = ingredients.filter((ingredient) => !ingredient.checked);
    setIngredients(filteredIngredients);
  };

  const handleToggleCheckbox = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].checked = !updatedIngredients[index].checked;
    setIngredients(updatedIngredients);
  };

  return (
    <div className="main-container">
      <div className="tab left-tab">
        <h2>Recipes</h2>
        <div className="scrollable-content">{"recipes"}</div>
      </div>
      <div className="tab right-tab">
        <h2>Ingredients</h2>
        <div className="scrollable-content">
          <input
            type="text"
            placeholder="Add ingredient"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
          />
          <button onClick={handleAddIngredient}>Add Ingredient</button>
          <div>
            {ingredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={ingredient.checked}
                  onChange={() => handleToggleCheckbox(index)}
                />
                {ingredient.name}
              </div>
            ))}
          </div>
          <button onClick={handleRemoveIngredients}>Remove Selected Ingredients</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;