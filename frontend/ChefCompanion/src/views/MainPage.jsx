import React, { useState, useEffect } from 'react';
import './MainPage.css';
import axios from 'axios';

function MainPage() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientRestrictions, setIngredientRestrictions] = useState([]);
  const [selected, setSelected] = useState(undefined);
  const [uniqueIngredients, setUniqueIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [restrictions, setRestrictions] = useState(false)

  const handleAddIngredient = () => {
    if (selectedIngredient.trim() !== '') {
      const isDuplicate = ingredients.concat(ingredientRestrictions).some((ingredient) => ingredient.name === selectedIngredient);
  
      if (!isDuplicate) {
        if (restrictions) {
          setIngredientRestrictions([...ingredientRestrictions, { name: selectedIngredient, checked: false }]);
        } else {
          setIngredients([...ingredients, { name: selectedIngredient, checked: false }]);
        }
        setSelectedIngredient('');
      } else {
        console.log('Ingredient already exists in the list.');
      }
    }
  };

  const handleRemoveIngredients = () => {
    const filteredIngredients = (restrictions ? ingredientRestrictions : ingredients).filter((ingredient) => !ingredient.checked);
    if (restrictions) {
      setIngredientRestrictions(filteredIngredients);
    } else {
      setIngredients(filteredIngredients);
    }
  };

  const getRecipes = () => {
    const filteredIngredients = ingredients
      .filter((ingredient) => ingredient.checked)
      .map(x => x.name);
  
    axios
      .post('/api/recipes', {
        ingredients: filteredIngredients,
        restrictions: ingredientRestrictions.map(x => x.name),
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
    const updatedIngredients = [...(restrictions ? ingredientRestrictions : ingredients)];
    updatedIngredients[index].checked = !updatedIngredients[index].checked;
    if (restrictions) {
      setIngredientRestrictions(updatedIngredients);
    } else {
      setIngredients(updatedIngredients);
    }
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
      {selected &&
        <div className="tab left-tab recipe">
          <h2 className="tab-header">{selected.title}</h2>
          <div className="scrollable-content">
            <h3>Ingredients</h3>
            <ul className='ingredients'>
              {selected.ingredients.map((x, i) =>
                <li key={i}>{x}</li>
              )}
            </ul>
            <h3>Directions</h3>
            <ol className='ingredients'>
              {selected.directions.map((x, i) =>
                <li key={i}>&nbsp;{x}</li>
              )}
            </ol>
            <br></br>
            <a href={'http://' + selected.link} target='_blank' rel='noreferrer'>{'http://' + selected.link}</a>
          </div>
          <button className='action-button' onClick={() => setSelected(undefined)}>Close</button>
        </div>
      }
      <div className="tab left-tab">
        <h2 className="tab-header">Recipes</h2>
        <div className="scrollable-content">
          <ul className='recipeList'>
            {recipes.map((recipe, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelected(recipe);
                  console.log(recipe)
                }}
              >
                {recipe.title}
              </button>
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
          {!restrictions && 
          <button className="action-button" onClick={() => setRestrictions(true)}>
            Switch to Dietary Restrictions List
          </button>}
          {restrictions &&
          <button className="action-button" onClick={() => setRestrictions(false)}>
            Switch to Ingredient List
          </button>
          }
          <div className="ingredient-list">
            {!restrictions && <h3> Ingredient List </h3>}
            {restrictions && <h3> Dietary Restriction List </h3>}
            {(restrictions ? ingredientRestrictions : ingredients).map((ingredient, index) => (
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
