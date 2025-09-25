// JavaScript для сторінки рецептів
document.addEventListener('DOMContentLoaded', function() {
    const recipesTableBody = document.getElementById('recipesTableBody');
    const recipesGrid = document.getElementById('recipesGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const recipesTable = document.getElementById('recipesTable');
    const recipesCards = document.getElementById('recipesCards');

    let allRecipes = [];

    async function loadRecipes() {
        try {
            const response = await fetch('http://localhost:3000/api/recipes');
            allRecipes = await response.json();
            displayRecipes(allRecipes);
        } catch (error) {
            console.error('Помилка завантаження рецептів:', error);
            allRecipes = [
                {
                    id: "1",
                    name: "Борщ",
                    category: "Супи",
                    cookingTime: "90 хв",
                    ingredients: ["буряк", "картопля", "морква", "капуста", "м'ясо"],
                    instructions: "Варимо м'ясо, додаємо овочі, варимо до готовності."
                },
                {
                    id: "2",
                    name: "Паста Карбонара",
                    category: "Паста",
                    cookingTime: "25 хв",
                    ingredients: ["паста", "бекон", "яйця", "пармезан", "чорний перець"],
                    instructions: "Варимо пасту, смажимо бекон, змішуємо з яйцями та сиром."
                },
                {
                    id: "3",
                    name: "Цезар",
                    category: "Салати",
                    cookingTime: "20 хв",
                    ingredients: ["салат", "курка", "гренки", "пармезан", "соус Цезар"],
                    instructions: "Смажимо курку, підсмажуємо гренки, змішуємо з салатом і соусом."
                }
            ];
            displayRecipes(allRecipes);
        }
    }

    function displayRecipesTable(recipes) {
        recipesTableBody.innerHTML = '';

        recipes.forEach(recipe => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${recipe.name}</td>
                <td>${recipe.category}</td>
                <td>${recipe.cookingTime}</td>
                <td>
                    <button class="btn-small btn-danger" onclick="deleteRecipe('${recipe.id}')">Видалити</button>
                </td>
            `;

            recipesTableBody.appendChild(row);
        });
    }

    function displayRecipesCards(recipes) {
        recipesGrid.innerHTML = '';

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';

            card.innerHTML = `
                <div class="recipe-card-content">
                    <h3 class="recipe-card-title">${recipe.name}</h3>
                    <div class="recipe-card-meta">
                        <span>${recipe.cookingTime}</span>
                        <span class="recipe-card-category">${recipe.category}</span>
                    </div>
                    <div class="recipe-card-ingredients">
                        <h4>Інгредієнти:</h4>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recipe-card-actions">
                        <button class="btn-small btn-danger" onclick="deleteRecipe('${recipe.id}')">Видалити</button>
                    </div>
                </div>
            `;

            recipesGrid.appendChild(card);
        });
    }

    function displayRecipes(recipes) {
        if (tableViewBtn.classList.contains('active')) {
            displayRecipesTable(recipes);
        } else {
            displayRecipesCards(recipes);
        }
    }

    function searchRecipes() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === '') {
            displayRecipes(allRecipes);
            return;
        }

        const filteredRecipes = allRecipes.filter(recipe => {
            if (recipe.name.toLowerCase().includes(searchTerm)) {
                return true;
            }

            return recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(searchTerm)
            );
        });

        displayRecipes(filteredRecipes);
    }

    window.deleteRecipe = async function(id) {
        if (confirm('Ви впевнені, що хочете видалити цей рецепт?')) {
            try {
                await fetch(`http://localhost:3000/api/recipes/${id}`, {
                    method: 'DELETE'
                });

                loadRecipes();
            } catch (error) {
                console.error('Помилка видалення рецепту:', error);
                allRecipes = allRecipes.filter(recipe => recipe.id !== id);
                displayRecipes(allRecipes);
            }
        }
    };

    searchBtn.addEventListener('click', searchRecipes);

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchRecipes();
        }
    });

    tableViewBtn.addEventListener('click', function() {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        recipesTable.classList.remove('hidden');
        recipesCards.classList.add('hidden');
        displayRecipesTable(allRecipes);
    });

    cardViewBtn.addEventListener('click', function() {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        recipesCards.classList.remove('hidden');
        recipesTable.classList.add('hidden');
        displayRecipesCards(allRecipes);
    });

    loadRecipes();
});