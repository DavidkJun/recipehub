// JavaScript для сторінки рецептів з пошуком через RegExp
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

    // Завантаження рецептів з сервера
    async function loadRecipes() {
        try {
            const response = await fetch('http://localhost:3000/api/recipes');
            allRecipes = await response.json();
            displayRecipes(allRecipes);
        } catch (error) {
            console.error('Помилка завантаження рецептів:', error);
            // Якщо сервер не доступний, використовуємо тестові дані
            allRecipes = getSampleRecipes();
            displayRecipes(allRecipes);
        }
    }

    // Тестові дані
    function getSampleRecipes() {
        return [
            {
                id: "1",
                name: "Борщ український",
                category: "Супи",
                cookingTime: "90 хв",
                ingredients: ["буряк", "картопля", "морква", "капуста", "м'ясо", "сметана"],
                instructions: "Варимо м'ясо, додаємо овочі, варимо до готовності."
            },
            {
                id: "2",
                name: "Паста Карбонара",
                category: "Паста",
                cookingTime: "25 хв",
                ingredients: ["спагеті", "бекон", "яйця", "пармезан", "чорний перець", "вершки"],
                instructions: "Варимо пасту, смажимо бекон, змішуємо з яйцями та сиром."
            },
            {
                id: "3",
                name: "Салат Цезар",
                category: "Салати",
                cookingTime: "20 хв",
                ingredients: ["салат айсберг", "курка", "гренки", "пармезан", "соус Цезар", "помідори"],
                instructions: "Смажимо курку, підсмажуємо гренки, змішуємо з салатом і соусом."
            },
            {
                id: "4",
                name: "Млинці з м'ясом",
                category: "Основні страви",
                cookingTime: "45 хв",
                ingredients: ["борошно", "яйця", "молоко", "фарш", "цибуля", "сметана"],
                instructions: "Готуємо тісто, смажимо млинці, готуємо начинку."
            },
            {
                id: "5",
                name: "Шоколадний торт",
                category: "Десерти",
                cookingTime: "60 хв",
                ingredients: ["борошно", "какао", "яйця", "цукор", "вершки", "шоколад"],
                instructions: "Змішуємо інгредієнти, випікаємо, декоруємо."
            }
        ];
    }

    // Відображення рецептів у таблиці
    function displayRecipesTable(recipes) {
        recipesTableBody.innerHTML = '';

        if (recipes.length === 0) {
            showNoResultsMessage('table');
            return;
        }

        recipes.forEach(recipe => {
            const row = document.createElement('tr');
            row.className = 'recipe-row';

            row.innerHTML = `
                <td>${recipe.name}</td>
                <td><span class="category-badge">${recipe.category}</span></td>
                <td>${recipe.cookingTime}</td>
                <td>
                    <button class="btn-small btn-danger" onclick="deleteRecipe('${recipe.id}')">Видалити</button>
                    <button class="btn-small btn-info" onclick="viewRecipe('${recipe.id}')">Деталі</button>
                </td>
            `;

            recipesTableBody.appendChild(row);
        });
    }

    // Відображення рецептів у вигляді карток
    function displayRecipesCards(recipes) {
        recipesGrid.innerHTML = '';

        if (recipes.length === 0) {
            showNoResultsMessage('cards');
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';

            card.innerHTML = `
                <div class="recipe-card-header">
                    <h3 class="recipe-card-title">${recipe.name}</h3>
                    <span class="recipe-card-time">${recipe.cookingTime}</span>
                </div>
                <div class="recipe-card-category">${recipe.category}</div>
                <div class="recipe-card-ingredients">
                    <h4>Інгредієнти:</h4>
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).slice(0, 4).join('')}
                        ${recipe.ingredients.length > 4 ? '<li>...</li>' : ''}
                    </ul>
                </div>
                <div class="recipe-card-actions">
                    <button class="btn-small btn-danger" onclick="deleteRecipe('${recipe.id}')">Видалити</button>
                    <button class="btn-small btn-info" onclick="viewRecipe('${recipe.id}')">Деталі</button>
                </div>
            `;

            recipesGrid.appendChild(card);
        });
    }

    // Відображення рецептів (залежно від вибраного виду)
    function displayRecipes(recipes) {
        if (tableViewBtn.classList.contains('active')) {
            displayRecipesTable(recipes);
        } else {
            displayRecipesCards(recipes);
        }
    }

    // Пошук рецептів з використанням RegExp
    function searchRecipes() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
            displayRecipes(allRecipes);
            return;
        }

        try {
            // Створення регулярного виразу для пошуку
            // Використовуємо прапор 'i' для ігнорування регістру
            const regex = new RegExp(searchTerm, 'i');

            const filteredRecipes = allRecipes.filter(recipe => {
                // Пошук за назвою
                if (regex.test(recipe.name)) {
                    return true;
                }

                // Пошук за категорією
                if (regex.test(recipe.category)) {
                    return true;
                }

                // Пошук за інгредієнтами
                const foundInIngredients = recipe.ingredients.some(ingredient =>
                    regex.test(ingredient)
                );

                if (foundInIngredients) {
                    return true;
                }

                return false;
            });

            // Підсвітка знайдених результатів
            const highlightedRecipes = filteredRecipes.map(recipe => {
                return {
                    ...recipe,
                    name: highlightText(recipe.name, searchTerm),
                    category: highlightText(recipe.category, searchTerm),
                    ingredients: recipe.ingredients.map(ingredient =>
                        highlightText(ingredient, searchTerm)
                    )
                };
            });

            displayRecipes(highlightedRecipes);

        } catch (error) {
            console.error('Помилка в регулярному виразі:', error);
            // Якщо RegExp невірний, використовуємо простий пошук
            simpleSearch(searchTerm);
        }
    }

    // Простий пошук (запасний варіант)
    function simpleSearch(searchTerm) {
        const term = searchTerm.toLowerCase();

        const filteredRecipes = allRecipes.filter(recipe => {
            if (recipe.name.toLowerCase().includes(term)) return true;
            if (recipe.category.toLowerCase().includes(term)) return true;
            return recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(term)
            );
        });

        displayRecipes(filteredRecipes);
    }

    // Підсвітка знайденого тексту
    function highlightText(text, searchTerm) {
        try {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        } catch (error) {
            return text;
        }
    }

    // Показати повідомлення про відсутність результатів
    function showNoResultsMessage(viewType) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <p>🔍 Рецептів за вашим запитом не знайдено.</p>
            <p>Спробуйте інші ключові слова або перевірте правильність написання.</p>
        `;

        if (viewType === 'table') {
            recipesTableBody.appendChild(message);
        } else {
            recipesGrid.appendChild(message);
        }
    }

    // Видалення рецепту
    window.deleteRecipe = async function(id) {
        if (confirm('Ви впевнені, що хочете видалити цей рецепт?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Оновлюємо список рецептів
                    loadRecipes();
                } else {
                    throw new Error('Помилка видалення');
                }
            } catch (error) {
                console.error('Помилка видалення рецепту:', error);
                // Якщо сервер не доступний, видаляємо локально
                allRecipes = allRecipes.filter(recipe => recipe.id !== id);
                displayRecipes(allRecipes);
                alert('Рецепт видалено (локально)');
            }
        }
    };

    // Перегляд деталей рецепту
    window.viewRecipe = function(id) {
        const recipe = allRecipes.find(r => r.id === id);
        if (recipe) {
            showRecipeDetails(recipe);
        }
    };

    // Показати деталі рецепту
    function showRecipeDetails(recipe) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${recipe.name}</h2>
                <div class="recipe-details">
                    <p><strong>Категорія:</strong> ${recipe.category}</p>
                    <p><strong>Час приготування:</strong> ${recipe.cookingTime}</p>
                    <div class="ingredients-list">
                        <h3>Інгредієнти:</h3>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="instructions">
                        <h3>Інструкції:</h3>
                        <p>${recipe.instructions}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Закриття модального вікна
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            document.body.removeChild(modal);
        };

        // Закриття при кліку поза модальним вікном
        modal.onclick = function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    // Обробники подій
    searchBtn.addEventListener('click', searchRecipes);

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchRecipes();
        }

        // Пошук в реальному часі (за бажанням)
        // if (searchInput.value.length >= 2 || searchInput.value.length === 0) {
        //     searchRecipes();
        // }
    });

    tableViewBtn.addEventListener('click', function() {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        recipesTable.classList.remove('hidden');
        recipesCards.classList.add('hidden');
        displayRecipes(allRecipes);
    });

    cardViewBtn.addEventListener('click', function() {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        recipesCards.classList.remove('hidden');
        recipesTable.classList.add('hidden');
        displayRecipes(allRecipes);
    });

    // Додаємо стилі для підсвітки та модального вікна
    addCustomStyles();

    // Завантаження рецептів при завантаженні сторінки
    loadRecipes();
});

// Додавання кастомних стилів
function addCustomStyles() {
    const styles = `
        /* Підсвітка результатів пошуку */
        mark {
            background-color: #ffeb3b;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        /* Модальне вікно */
        .modal {
            display: block;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border-radius: 10px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: black;
        }
        
        .recipe-details {
            margin-top: 20px;
        }
        
        .ingredients-list ul, .instructions p {
            margin-left: 20px;
        }
        
        /* Повідомлення про відсутність результатів */
        .no-results {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-style: italic;
            grid-column: 1 / -1;
        }
        
        .no-results p {
            margin: 10px 0;
        }
        
        /* Категорія в таблиці */
        .category-badge {
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        
        /* Кнопки */
        .btn-info {
            background: #3498db;
            color: white;
        }
        
        .btn-small {
            padding: 5px 10px;
            margin: 2px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}