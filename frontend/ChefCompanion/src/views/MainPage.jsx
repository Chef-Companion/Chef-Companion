import { useState, useEffect } from "react";
import "./MainPage.css";
import axios from "axios";

function MainPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState(new Set()); // new
  const [checkedIngredients, setCheckedIngredients] = useState(new Set()); // new
  const [forbiddenIngredients, setForbiddenIngredients] = useState(new Set()); // new
  const [showMissing, setShowMissing] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [uniqueIngredients, setUniqueIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [substitutionEnable, setSubstitutionEnable] = useState(true);
  const [ingredientMode, setIngredientMode] = useState(true);

  const parseIngredients = (ingredientSet, checkedSet) => {
    let parsedList = [];
    const ingredientList = [...ingredientSet];
    for (const e of ingredientList) {
      if (checkedSet.has(e)) {
        parsedList.push(e);
      }
    }
    return parsedList;
  };

  const toggleSelectedIngredient = (ingredient) => {
    if (!selectedIngredients.has(ingredient)) {
      selectedIngredients.add(ingredient);
      forbiddenIngredients.delete(ingredient);
      checkedIngredients.add(ingredient);
      setForbiddenIngredients(new Set(forbiddenIngredients));
    } else {
      selectedIngredients.delete(ingredient);
      checkedIngredients.delete(ingredient);
    }
    setSelectedIngredients(new Set(selectedIngredients));
    setCheckedIngredients(new Set(checkedIngredients));
  };

  const toggleForbiddenIngredient = (ingredient) => {
    if (!forbiddenIngredients.has(ingredient)) {
      selectedIngredients.delete(ingredient);
      forbiddenIngredients.add(ingredient);
      checkedIngredients.add(ingredient);
      setSelectedIngredients(new Set(selectedIngredients));
    } else {
      forbiddenIngredients.delete(ingredient);
      checkedIngredients.delete(ingredient);
    }
    setForbiddenIngredients(new Set(forbiddenIngredients));
    setCheckedIngredients(new Set(checkedIngredients));
  };

  const toggleCheckedIngredient = (ingredient) => {
    if (!checkedIngredients.has(ingredient)) {
      checkedIngredients.add(ingredient);
    } else {
      checkedIngredients.delete(ingredient);
    }
    setCheckedIngredients(new Set(checkedIngredients));
  };

  const getRecipesRanked = () => {
    const _selectedIngredients = parseIngredients(
      selectedIngredients,
      checkedIngredients,
    );
    const _forbiddenIngredients = parseIngredients(
      forbiddenIngredients,
      checkedIngredients,
    );

    axios
      .post("/api/recipes_ranked", {
        selected_ingredients: _selectedIngredients,
        forbidden_ingredients: _forbiddenIngredients,
        enable_substitutions: substitutionEnable,
      })
      .then((response) => {
        setRecipes(response.data.result);
      })
      .catch((error) => {
        console.error("error getting ranked recipes ", error);
      });
  };

  const toggleSubstitutions = () => {
    setSubstitutionEnable(!substitutionEnable);
  };

  const filteredIngredients = uniqueIngredients
    .filter((ingredient) =>
      ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .map((ingredient) => ingredient.toLowerCase())
    .sort();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSelections = () => {
    setSelectedIngredients(new Set());
    setCheckedIngredients(new Set());
    setForbiddenIngredients(new Set());
  };

  const getColorClass = (score) => {
    if (score == null) {
      return "color-null";
    }
    if (score < -100) {
      return "color-c0";
    }
    if (score < 2) {
      return "color-c1";
    } else if (score < 5) {
      return "color-c2";
    } else if (score < 8) {
      return "color-c3";
    } else if (score < 10) {
      return "color-c4";
    } else {
      return "color-c6";
    }
  };

  useEffect(() => {
    axios
      .get("/api/recipes")
      .then((response) => {
        setRecipes(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/api/unique-ingredients/")
      .then((response) => response.json())
      .then((data) => setUniqueIngredients(data.unique_ingredients))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="main-container">
      {selected && (
        <div className="tab left-tab recipe">
          <h2 className="tab-header">{selected.title}</h2>
          <div className="scrollable-content">
            <h3>Ingredients</h3>
            <ul className="ingredients">
              {selected.ingredients.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
            <button
              className="action-button"
              onClick={() => setShowMissing(!showMissing)}
            >
              {" "}
              {showMissing ? "Hide" : "Show"} Missing Ingredients
            </button>
            {showMissing && (
              <div>
                <h3>Missing Ingredients</h3>
                <ul className="ingredients">
                  {selected.NER.filter(
                    (ingredient) =>
                      !parseIngredients(
                        selectedIngredients,
                        checkedIngredients,
                      ).includes(ingredient),
                  ).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
            <h3>Directions</h3>
            <ol className="ingredients">
              {selected.directions.map((x, i) => (
                <li key={i}>&nbsp;{x}</li>
              ))}
            </ol>
            <br></br>
            <a
              href={"http://" + selected.link}
              target="_blank"
              rel="noreferrer"
            >
              {"http://" + selected.link}
            </a>
          </div>
          <button
            className="action-button"
            onClick={() => setSelected(undefined)}
          >
            Close
          </button>
        </div>
      )}
      <div className="tab left-tab">
        <h2 className="tab-header">Recipes</h2>
        <div className="scrollable-content">
          <ul className="recipeList">
            {recipes.map((recipe, index) => (
              <span className={getColorClass(recipe.score)} key={index}>
                <button
                  className="button-recipe"
                  onClick={() => {
                    setSelected(recipe);
                    console.log(recipe);
                  }}
                >
                  <span
                    className={`${
                      recipe.score !== undefined && recipe.score > 10
                        ? "bold"
                        : ""
                    }`}
                  >
                    {" "}
                    {recipe.title}{" "}
                  </span>{" "}
                  <br></br>
                  {recipe.score !== undefined && recipe.score > 10 && (
                    <span className="good-match">Good Match!</span>
                  )}
                </button>
              </span>
            ))}
          </ul>
        </div>
      </div>
      <div className="tab right-tab">
        <div className="tab right-tab top">
          <h2 className="tab-header">Ingredients</h2>
          <input
            type="text"
            className="ingredient-search"
            placeholder="Search Ingredients"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="tab right-tab top scroll">
            {filteredIngredients.map((ingredient, index) => (
              <div
                key={index}
                className={`ingredient ${
                  selectedIngredients.has(ingredient) ? "selected" : ""
                }${forbiddenIngredients.has(ingredient) ? "forbidden" : ""}`}
              >
                <span
                  className="ingredient-entry-name"
                  onClick={() => toggleSelectedIngredient(ingredient)}
                >
                  {ingredient}
                </span>
                <button
                  className="ingredient-entry-restrict"
                  onClick={() => toggleForbiddenIngredient(ingredient)}
                >
                  {" "}
                  restrict{" "}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="tab right-tab bottom">
          <div>
            <button
              className={`button-selected-mode ${
                ingredientMode ? "selected" : ""
              }`}
              onClick={() => setIngredientMode(true)}
            >
              {" "}
              Selected Ingredients{" "}
            </button>
            <button
              className={`button-selected-mode ${
                !ingredientMode ? "selected" : ""
              }`}
              onClick={() => setIngredientMode(false)}
            >
              {" "}
              Restricted Ingredients{" "}
            </button>
          </div>
          <div className="tab right-tab top scroll">
            {ingredientMode && (
              <div>
                {[...selectedIngredients].sort().map((ingredient, index) => (
                  <div
                    key={index}
                    className={`ingredient ${
                      checkedIngredients.has(ingredient) ? "selected2" : ""
                    }`}
                  >
                    {checkedIngredients.has(ingredient) && (
                      <span className="checkmark-span">&#x2713;</span>
                    )}
                    {!checkedIngredients.has(ingredient) && (
                      <span className="checkmark-span"></span>
                    )}
                    <span
                      className="ingredient-entry-name"
                      onClick={() => toggleCheckedIngredient(ingredient)}
                    >
                      {ingredient}
                    </span>
                    <button
                      className="ingredient-entry-restrict"
                      onClick={() => toggleSelectedIngredient(ingredient)}
                    >
                      {" "}
                      remove{" "}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {!ingredientMode && (
              <div>
                {[...forbiddenIngredients].sort().map((ingredient, index) => (
                  <div
                    key={index}
                    className={`ingredient ${
                      checkedIngredients.has(ingredient) ? "forbidden2" : ""
                    }`}
                  >
                    {checkedIngredients.has(ingredient) && (
                      <span className="checkmark-span">&#x2713;</span>
                    )}
                    {!checkedIngredients.has(ingredient) && (
                      <span className="checkmark-span"></span>
                    )}
                    <span
                      className="ingredient-entry-name"
                      onClick={() => toggleCheckedIngredient(ingredient)}
                    >
                      {ingredient}
                    </span>
                    <button
                      className="ingredient-entry-restrict"
                      onClick={() => toggleForbiddenIngredient(ingredient)}
                    >
                      {" "}
                      remove{" "}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="buttons">
          <button className="button-submit" onClick={getRecipesRanked}>
            Generate Recipes
          </button>
          <button
            className={`toggle-substitution ${
              substitutionEnable ? "selected" : ""
            }`}
            onClick={toggleSubstitutions}
          >
            {substitutionEnable && <span>&#x1F5F9; substitutions </span>}
            {!substitutionEnable && <span>&#x2610; substitutions </span>}
          </button>
          <button className="button-clear" onClick={clearSelections}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
