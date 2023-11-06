import React, { useState, useEffect } from 'react';
import './MainPage.css';
import axios from 'axios';

function MainPage() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [uniqueIngredients, setUniqueIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddIngredient = () => {
    if (selectedIngredient.trim() !== '') {
      const isDuplicate = ingredients.some((ingredient) => ingredient.name === selectedIngredient);
  
      if (!isDuplicate) {
        setIngredients([...ingredients, { name: selectedIngredient, checked: false }]);
        setSelectedIngredient('');
      } else {
        console.log('Ingredient already exists in the list.');
      }
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

  const filteredIngredients = uniqueIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIngredient('');
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

  useEffect(() => {
    fetch('/api/unique-ingredients/')
        .then(response => response.json())
        .then(data => setUniqueIngredients(data.unique_ingredients))
        .catch(error => console.error('Error fetching data:', error));
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
          <div className="unique-ingredients-container">
            <input
              type="text"
              placeholder="Search ingredients"
              value={searchQuery}
              onChange={handleSearch}
            />
            <ul className="unique-ingredient-list">
              {filteredIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`ingredient ${selectedIngredient === ingredient ? 'selected' : ''}`}
                  onClick={() => setSelectedIngredient(ingredient)}
                >
                  {ingredient}
                </div>
              ))}
            </ul>
          </div>
          <button className="action-button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
          <div className="ingredient-list">
            <h3>Ingredient List</h3>
            {ingredients.map((ingredient, index) => (
              <div className="ingredient-item" key={index}>
                <input
                  type="checkbox"
                  checked={ingredient.checked}
                  onChange={() => handleToggleCheckbox(index)}
                />
                <p className="ingredient-name">{ingredient.name}</p>
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
