import React, { useState } from 'react'

const RecipeCard = ({ recipe, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false)

    const handleDelete = async () => {
        if (window.confirm('Видалити цей рецепт?')) {
            try {
                await fetch(`http://localhost:3000/api/recipes/${recipe.id}`, {
                    method: 'DELETE'
                })
                onDelete()
            } catch (error) {
                console.error('Помилка видалення:', error)
            }
        }
    }

    return (
        <div className="recipe-card">
            <div className="recipe-card-header">
                <h3>{recipe.name}</h3>
                <span className="cooking-time">{recipe.cookingTime}</span>
            </div>

            <div className="recipe-card-meta">
                <span className="category">{recipe.category}</span>
            </div>

            <div className="recipe-card-ingredients">
                <h4>Інгредієнти:</h4>
                <ul>
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                    {recipe.ingredients.length > 3 && <li>...</li>}
                </ul>
            </div>

            <div className="recipe-card-actions">
                <button
                    className="btn-info"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Сховати' : 'Деталі'}
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                    Видалити
                </button>
            </div>

            {showDetails && (
                <div className="recipe-details">
                    <h4>Інструкції:</h4>
                    <p>{recipe.instructions}</p>
                    <h4>Всі інгредієнти:</h4>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default RecipeCard