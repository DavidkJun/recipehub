import React from 'react'

const SearchRecipes = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-recipes">
            <input
                type="text"
                placeholder="Пошук за назвою, категорією або інгредієнтами..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
            />
        </div>
    )
}

export default SearchRecipes