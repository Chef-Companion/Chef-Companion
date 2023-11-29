import './searchStyles.css';

const SearchComponent = () => {
  return (
    <div>
      {getSearchResults(10).map((item) => (
        <div className="searchItem" key={item.id} >
          <h3>{item.title}</h3>
          <p>ingredients: {item.ingredients.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};


const getSearchResults = (input) => {
    // input should be a dictionary of filters. Filtering options include ingredients, text input, time to prepare, etc.

    // PLACEHOLDER DATA
    input = 2; // avoid unused variable warning
    let recipes = [];
    recipes.push({'id':1, 'title': 'omelette', 'ingredients': ['egg', 'butter', 'salt'], 'time': 5});
    recipes.push({'id':2, 'title': 'fried rice', 'ingredients': ['rice', 'egg', 'onions', 'garlic', 'vegetable oil', 'salt'], 'time': 10});
    return recipes;
};

export default SearchComponent;