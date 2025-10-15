import React, { useState, useEffect } from 'react'
import RecipeList from './components/RecipeList'
import AddRecipe from './components/AddRecipe'
import SearchRecipes from './components/SearchRecipes'
import './App.css'

function App() {
    const [recipes, setRecipes] = useState([])
    const [view, setView] = useState('list') // 'list' or 'add'
    const [searchTerm, setSearchTerm] = useState('')

    // Завантаження рецептів
    useEffect(() => {
        loadRecipes()
    }, [])

    const loadRecipes = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/recipes')
            const data = await response.json()
            setRecipes(data)
        } catch (error) {
            console.error('Помилка завантаження:', error)
        }
    }

    // Фільтрація рецептів
    const filteredRecipes = recipes.filter(recipe => {
        if (!searchTerm) return true

        const regex = new RegExp(searchTerm, 'i')
        return (
            regex.test(recipe.name) ||
            regex.test(recipe.category) ||
            recipe.ingredients.some(ingredient => regex.test(ingredient))
        )
    })

    return (
        <div className="app">
            <header className="app-header">
                <h1>🍳 RecipeHub - React</h1>
                <nav>
                    <button
                        className={view === 'list' ? 'active' : ''}
                        onClick={() => setView('list')}
                    >
                        Всі рецепти
                    </button>
                    <button
                        className={view === 'add' ? 'active' : ''}
                        onClick={() => setView('add')}
                    >
                        Додати рецепт
                    </button>
                </nav>
            </header>

            <main className="app-main">
                {view === 'list' ? (
                    <>
                        <SearchRecipes
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                        <RecipeList
                            recipes={filteredRecipes}
                            onRecipeDelete={loadRecipes}
                        />
                    </>
                ) : (
                    <AddRecipe onRecipeAdded={() => {
                        setView('list')
                        loadRecipes()
                    }} />
                )}
            </main>
        </div>
    )
}

export default App