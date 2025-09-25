import React, { useState } from 'react'

const AddRecipe = ({ onRecipeAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        cookingTime: '',
        ingredients: '',
        instructions: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newRecipe = {
            ...formData,
            ingredients: formData.ingredients.split('\n').filter(line => line.trim()),
            cookingTime: formData.cookingTime + ' хв'
        }

        try {
            const response = await fetch('http://localhost:3000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecipe)
            })

            if (response.ok) {
                alert('Рецепт додано!')
                setFormData({
                    name: '',
                    category: '',
                    cookingTime: '',
                    ingredients: '',
                    instructions: ''
                })
                onRecipeAdded()
            }
        } catch (error) {
            console.error('Помилка додавання:', error)
        }
    }

    return (
        <div className="add-recipe">
            <h2>Додати новий рецепт</h2>
            <form onSubmit={handleSubmit} className="recipe-form">
                <div className="form-group">
                    <label>Назва рецепту:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Категорія:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Оберіть категорію</option>
                        <option value="Супи">Супи</option>
                        <option value="Основні страви">Основні страви</option>
                        <option value="Салати">Салати</option>
                        <option value="Десерти">Десерти</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Час приготування (хв):</label>
                    <input
                        type="number"
                        name="cookingTime"
                        value={formData.cookingTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Інгредієнти (кожен з нового рядка):</label>
                    <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Інструкції:</label>
                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        rows="6"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">Додати рецепт</button>
            </form>
        </div>
    )
}

export default AddRecipe