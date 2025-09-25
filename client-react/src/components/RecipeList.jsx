import React from 'react'
import RecipeCard from './RecipeCard'

const RecipeList = ({ recipes, onRecipeDelete }) => {
    if (recipes.length === 0) {
        return (
            <div className="no-recipes">
                <p>🔍 Рецептів не знайдено</p>
            </div>
        )
    }

    return (
        <div className="recipe-list">
            <h2>Знайдено рецептів: {recipes.length}</h2>
            <div className="recipes-grid">
                {recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={onRecipeDelete}
                    />
                ))}
            </div>
        </div>
    )
}

export default RecipeList