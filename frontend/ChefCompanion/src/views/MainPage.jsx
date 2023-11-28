import React, { useState, useEffect } from 'react';
import './MainPage.css';
import axios from 'axios';

function MainPage() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]); // new
  const [checkedIngredients, setCheckedIngredients] = useState([]); // new
  const [forbiddenIngredients, setForbiddenIngredients] = useState([]); // new
  const [ingredientsID, setIngredientsID] = useState({});
  const [ingredientsName, setIngredientsName] = useState({});
  const [showMissing, setShowMissing] = useState(false)
  const [ingredientRestrictions, setIngredientRestrictions] = useState([]);
  const [selected, setSelected] = useState(undefined);
  const [uniqueIngredients, setUniqueIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [restrictions, setRestrictions] = useState(false);
  const [substitutionEnable, setSubstitutionEnable] = useState(true);
  const [ingredientMode, setIngredientMode] = useState(true);

  const handleAddIngredient = () => {
    if (selectedIngredient.trim() !== '') {
      const isDuplicate = ingredients.concat(ingredientRestrictions).some((ingredient) => ingredient.name === selectedIngredient);
  
      if (!isDuplicate) {
        if (restrictions) {
          setIngredientRestrictions([...ingredientRestrictions, { name: selectedIngredient, checked: true }]);
        } else {
          setIngredients([...ingredients, { name: selectedIngredient, checked: true }]);
        }
        setSelectedIngredient('');
      } else {
        console.log('Ingredient already exists in the list.');
      }
    }
  };

  const parseIngredients = (vectorizedList, checkedList) => {
    parsedList = []
    for (let i = 0; i < vectorizedList.length; ++i) {
      if (vectorizedList[i] && checkedList[i]) {
        parsedList.push(ingredientsName[i]);
      }
    }
    console.log(`parsedList ${parsedList}`);
    return parsedList;
  }

  const handleIngredientOperation = (ingredient, mode, ingredientMode) => {
    /*
    Mode options: 'add', 'remove'
    ingredientMode options: 'list', 'forbidden', 'checked'
    */
    const ingredientID = ingredientsID[ingredient];
    if (ingredientID == null) {
      console.log('ingredient error: not found')
      return
    }
    if (mode == 'add') {
      if (ingredientMode == 'list') {
        selectedIngredients[ingredientID] = 1;
        forbiddenIngredients[ingredientID] = 0;
        checkedIngredients[ingredientID] = 1;
        console.log('ADDING');
      } else if (ingredientMode == 'forbidden') {
        selectedIngredients[ingredientID] = 0;
        forbiddenIngredients[ingredientID] = 1;
        checkedIngredients[ingredientID] = 1;
      } else if (ingredientMode == 'checked') {
        checkedIngredients[ingredientID] = 1;
      }
    } else if (mode == 'remove') {
      if (ingredientMode == 'list') {
        selectedIngredients[ingredientID] = 0;
        checkedIngredients[ingredientID] = 0;
      } else if (ingredientMode == 'forbidden') {
        forbiddenIngredients[ingredientID] = 0;
        checkedIngredients[ingredientID] = 0;
      } else if (ingredientMode == 'checked') {
        checkedIngredients[ingredientID] = 0;
      }
    }
    setSelectedIngredients([...selectedIngredients]);
    setForbiddenIngredients([...forbiddenIngredients]);
    setCheckedIngredients([...checkedIngredients]);
  }

  const handleRemoveIngredients = () => {
    const filteredIngredients = (restrictions ? ingredientRestrictions : ingredients).filter((ingredient) => !ingredient.checked);
    if (restrictions) {
      setIngredientRestrictions(filteredIngredients);
    } else {
      setIngredients(filteredIngredients);
    }
  };

  const getRecipesRanked = () => {
    const _selectedIngredients = parseIngredients(selectedIngredients, checkedIngredients);
    const _forbiddenIngredients = parseIngredients(forbiddenIngredients, checkedIngredients);

    axios
      .post('/api/recipes_ranked', {
        selected_ingredients: _selectedIngredients,
        forbidden_ingredients: _forbiddenIngredients,
        enable_substitutions: substitutionEnable
      })
      .then((response) => {
        setRecipes(response.data.result);
      })
      .catch((error) => {
        console.error("error getting ranked recipes ", error);
      })
  };
/*
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
  };*/

  const toggleSubstitutions = () => {
    setSubstitutionEnable(!substitutionEnable);
    console.log(`substition: ${substitutionEnable}`)
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

  const getColorClass = (score) => {
    if (score < 2) {
      return 'color-c1';
    }
    else if (score < 5) {
      return 'color-c2';
    }
    else if (score < 8) {
      return 'color-c3';
    }
    else if (score < 10) {
      return 'color-c4';
    }
    else {
      return 'color-c6';
    }
  }

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

    setSelectedIngredients(Array.from({ length: uniqueIngredients.length }, () => 0));
    setForbiddenIngredients(Array.from({ length: uniqueIngredients.length }, () => 0));
    setCheckedIngredients(Array.from({ length: uniqueIngredients.length }, () => 0));

   
  }, []);

  useEffect(() => {
    let i = 0;
    for (const ingredient of uniqueIngredients) {
      ingredientsID[ingredient] = i;
      ingredientsName[i] = ingredient;
      i++;
    }
    console.log(JSON.stringify(ingredientsID))
  }, [uniqueIngredients])

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
            <button className='action-button' onClick={() => setShowMissing(!showMissing)}> {showMissing ? "Hide" : "Show"} Missing Ingredients</button>
            {showMissing && 
              <h3>Missing Ingredients</h3> &&
              <ul className='ingredients'>
                {selected.NER.filter((ingredient) => !ingredients.map((i) => i.name).includes(ingredient)).map((x, i) =>
                  <li key={i}>{x}</li>
                )}
              </ul>
            }
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
              <span className={getColorClass(recipe.score)}>
                <button
                  className='button-recipe'
                  key={index}
                  onClick={() => {
                    setSelected(recipe);
                    console.log(recipe)
                  }}
                >
                  {recipe.title} <br></br>
                  {recipe.score !== undefined && parseInt(recipe.score * 10)}
                </button>
              </span>
            ))}
          </ul>
        </div>
      </div>
      <div className="tab right-tab new">
        <input
          type="text"
          placeholder="Search Ingredients"
          value={searchQuery}
          onChange={handleSearch}
        />
        {filteredIngredients.map((ingredient, index) => (
          <div
            key={index}
            className={`ingredient ${selectedIngredients[ingredientsID[ingredient]] == 1 ? 'selected' : ''}`}
          >
            {ingredient}
            <span onClick={() =>handleIngredientOperation(ingredient, 'add', 'list')}></span>
          </div>
        ))}
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
          <button className="action-button" onClick={toggleSubstitutions}>
            substitutions: {substitutionEnable ? 'True' : 'False'}
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
          <button className="action-button" onClick={getRecipesRanked}>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
