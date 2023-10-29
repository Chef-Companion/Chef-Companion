import React, { useState, useEffect } from 'react';

const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [dictionary, setDictionary] = useState({});

  useEffect(() => {
    const newDictionary = getSearchResults(inputValue);
    setDictionary(newDictionary);
  }, [inputValue]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="recipe name"
      />
      <div>
        {Object.keys(dictionary).map((key) => (
          <div key={key}>
            {key}: {dictionary[key]}
          </div>
        ))}
      </div>
    </div>
  );
};

const getSearchResults = (input) => {
    // input should be a dictionary of filters. Filtering options include ingredients, text input, time to prepare, etc.

    // PLACEHOLDER DATA
    input = 2; // avoid unused variable warning
    const dictionary = {};
    dictionary['omelette'] = {'ingredients': ['egg', 'butter', 'salt'], 'time': 5};
    dictionary['fried rice'] = {'ingredients': ['rice', 'egg', 'onions', 'garlic', 'vegetable oil', 'salt'], 'time': 10};
    return dictionary;
};

export default SearchComponent;