import React, { useEffect, useState } from 'react';
import './UniqueIngredients.css';

function UniqueIngredients() {
    // Define states using the useState hook
    const [uniqueIngredients, setUniqueIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch unique ingredients from the server when the component mounts
    useEffect(() => {
        fetch('/api/unique-ingredients/')
            .then(response => response.json())
            .then(data => setUniqueIngredients(data.unique_ingredients))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Filter unique ingredients based on the search query
    const filteredIngredients = uniqueIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle changes to the search input field
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSelectedIngredient('');
    };

    return (
        <div className="unique-ingredients-container">
            {/* Input field for searching ingredients */}
            <input
                type="text"
                placeholder="Search for an ingredient"
                value={searchQuery}
                onChange={handleSearch}
            />
            {/* List of filtered ingredients */}
            <div className="unique-ingredient-list">
                {filteredIngredients.map((ingredient, index) => (
                    <div
                        key={index}
                        className={`ingredient ${selectedIngredient === ingredient ? 'selected' : ''}`}
                        onClick={() => setSelectedIngredient(ingredient)}
                    >
                        {ingredient}
                    </div>
                ))}
            </div>
            {/* Display the selected ingredient */}
            <p>Selected Ingredient: {selectedIngredient}</p>
        </div>
    );
}

export default UniqueIngredients;
