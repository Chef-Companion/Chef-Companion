import React, { useState, useEffect } from 'react';
import './MainPage.css';
import axios from 'axios';

function MainPage() {
  const [recipes, setRecipes] = useState([]);
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

  const getRecipes = () => {
    const filteredIngredients = ingredients
      .filter((ingredient) => ingredient.checked)
      .map(x => x.name);
  
    axios
      .post('/api/recipes', {
        ingredients: filteredIngredients,
        ingredients_mode: 'any',
        ingredient_mode: 'exact',
      })
      .then((response) => {
        setRecipes(response.data.result);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  };

  const handleToggleCheckbox = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].checked = !updatedIngredients[index].checked;
    setIngredients(updatedIngredients);
  };

  useEffect(() => {
    axios.get('/api/recipes')
      .then((response) => {
        setRecipes(response.data.result);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []); 

  return (
    <div className="main-container">
      <div className="tab left-tab">
        <h2 className="tab-header">Recipes</h2>
        <div className="scrollable-content">
          <ul className='recipeList'>
            {recipes.map((recipe, index) => (
              <a key={index} href={'http://' + recipe.link} target='_blank' rel='noreferrer'>{recipe.title}</a>
            ))}
          </ul>
        </div>
      </div>
      <div className="tab right-tab">
        <h2 className="tab-header">Ingredients</h2>
        <div className="scrollable-content">
          <input
            type="text"
            placeholder="Add ingredient"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
          />
          <button className="action-button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
          <div className="ingredient-list">
            {ingredients.map((ingredient, index) => (
              <div className="ingredient-item" key={index}>
                <input
                  type="checkbox"
                  checked={ingredient.checked}
                  onChange={() => handleToggleCheckbox(index)}
                />
                {ingredient.name}
              </div>
            ))}
          </div>
          <button className="action-button" onClick={handleRemoveIngredients}>
            Remove Selected Ingredients
          </button>
          <button className="action-button" onClick={getRecipes}>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;