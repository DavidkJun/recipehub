document.addEventListener('DOMContentLoaded', function() {
    const recipesTableBody = document.getElementById('recipesTableBody');
    const recipesGrid = document.getElementById('recipesGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const recipesTable = document.getElementById('recipesTable');
    const recipesCards = document.getElementById('recipesCards');
    const resultsCount = document.getElementById('resultsCount');
    const currentRange = document.getElementById('currentRange');
    const totalRecipes = document.getElementById('totalRecipes');
    const pageNumbers = document.getElementById('pageNumbers');
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');
    const pageSizeSelect = document.getElementById('pageSizeSelect');

    let allRecipes = [];
    let filteredRecipes = [];
    let currentPage = 1;
    let pageSize = 10;
    let totalPages = 1;

    async function loadRecipes() {
        try {
            const response = await fetch('./data/recipes.json');
            const jsonRecipes = await response.json();

            const localRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');

            const allRecipesMap = new Map();

            jsonRecipes.forEach(recipe => {
                allRecipesMap.set(recipe.id, recipe);
            });

            localRecipes.forEach(recipe => {
                allRecipesMap.set(recipe.id, recipe);
            });

            allRecipes = Array.from(allRecipesMap.values());

            initializePagination();

        } catch (error) {
            console.error('Помилка завантаження рецептів:', error);
            const localRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            allRecipes = localRecipes.length > 0 ? localRecipes : getSampleRecipes();
            initializePagination();
        }
    }

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
            }
        ];
    }

    function initializePagination() {
        filteredRecipes = [...allRecipes];
        updatePagination();
    }

    function updatePagination() {
        totalRecipes.textContent = filteredRecipes.length;
        resultsCount.textContent = filteredRecipes.length;

        totalPages = Math.ceil(filteredRecipes.length / pageSize);

        if (currentPage > totalPages) {
            currentPage = totalPages || 1;
        }

        updatePaginationButtons();

        updatePageNumbers();

        displayCurrentPage();
    }

    function updatePaginationButtons() {
        firstPageBtn.disabled = currentPage === 1;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        lastPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function updatePageNumbers() {
        pageNumbers.innerHTML = '';

        if (totalPages === 0) {
            return;
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }

        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToPage(i);
            pageNumbers.appendChild(pageBtn);
        }
    }

    function displayCurrentPage() {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, filteredRecipes.length);
        const currentPageRecipes = filteredRecipes.slice(startIndex, endIndex);

        if (filteredRecipes.length > 0) {
            currentRange.textContent = `${startIndex + 1}-${endIndex}`;
        } else {
            currentRange.textContent = '0-0';
        }

        displayRecipes(currentPageRecipes);
    }

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            updatePagination();
        }
    }

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

    function displayRecipes(recipes) {
        if (tableViewBtn.classList.contains('active')) {
            displayRecipesTable(recipes);
        } else {
            displayRecipesCards(recipes);
        }
    }

    function searchRecipes() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
            filteredRecipes = [...allRecipes];
        } else {
            try {
                const regex = new RegExp(searchTerm, 'i');
                filteredRecipes = allRecipes.filter(recipe =>
                    regex.test(recipe.name) ||
                    regex.test(recipe.category) ||
                    recipe.ingredients.some(ingredient => regex.test(ingredient))
                );
            } catch (error) {
                const term = searchTerm.toLowerCase();
                filteredRecipes = allRecipes.filter(recipe =>
                    recipe.name.toLowerCase().includes(term) ||
                    recipe.category.toLowerCase().includes(term) ||
                    recipe.ingredients.some(ingredient =>
                        ingredient.toLowerCase().includes(term)
                    )
                );
            }
        }

        currentPage = 1;
        updatePagination();
    }

    function clearSearch() {
        searchInput.value = '';
        filteredRecipes = [...allRecipes];
        currentPage = 1;
        updatePagination();
    }

    function showNoResultsMessage(viewType) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <p>🔍 Рецептів не знайдено</p>
            <p>Спробуйте змінити пошуковий запит або очистіть пошук</p>
        `;

        if (viewType === 'table') {
            recipesTableBody.appendChild(message);
        } else {
            recipesGrid.appendChild(message);
        }
    }

    window.deleteRecipe = async function(id) {
        if (confirm('Ви впевнені, що хочете видалити цей рецепт?')) {
            try {
                allRecipes = allRecipes.filter(recipe => recipe.id !== id);
                filteredRecipes = filteredRecipes.filter(recipe => recipe.id !== id);

                localStorage.setItem('recipes', JSON.stringify(allRecipes.filter(recipe =>
                    !recipe.id.startsWith('json-')
                )));

                updatePagination();
                alert('Рецепт видалено!');
            } catch (error) {
                console.error('Помилка видалення рецепту:', error);
                alert('Помилка при видаленні рецепту');
            }
        }
    };

    window.viewRecipe = function(id) {
        const recipe = allRecipes.find(r => r.id === id);
        if (recipe) {
            showRecipeDetails(recipe);
        }
    };

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

        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            document.body.removeChild(modal);
        };

        modal.onclick = function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    searchBtn.addEventListener('click', searchRecipes);
    clearSearchBtn.addEventListener('click', clearSearch);

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
        displayCurrentPage();
    });

    cardViewBtn.addEventListener('click', function() {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        recipesCards.classList.remove('hidden');
        recipesTable.classList.add('hidden');
        displayCurrentPage();
    });

    firstPageBtn.addEventListener('click', () => goToPage(1));
    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    lastPageBtn.addEventListener('click', () => goToPage(totalPages));

    pageSizeSelect.addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        updatePagination();
    });

    addCustomStyles();

    loadRecipes();
});

function addCustomStyles() {
    const styles = `
        /* Стилі для пагінації */
        .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .pagination-info {
            color: #666;
            font-size: 0.9rem;
        }
        
        .pagination-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .pagination-btn, .page-number {
            padding: 0.5rem 0.8rem;
            border: 1px solid #ddd;
            background: white;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .pagination-btn:hover:not(:disabled),
        .page-number:hover:not(.active) {
            background: #f8f9fa;
            border-color: #e74c3c;
        }
        
        .pagination-btn:disabled {
            background: #f8f9fa;
            color: #ccc;
            cursor: not-allowed;
        }
        
        .page-number.active {
            background: #e74c3c;
            color: white;
            border-color: #e74c3c;
        }
        
        .page-numbers {
            display: flex;
            gap: 0.3rem;
        }
        
        .page-size-selector {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .page-size-selector select {
            padding: 0.3rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .controls {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .results-count {
            color: #666;
            font-size: 0.9rem;
        }
        
        .search-controls {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .search-controls input {
            flex: 1;
            min-width: 200px;
        }
        
        @media (max-width: 768px) {
            .pagination-container {
                flex-direction: column;
                text-align: center;
            }
            
            .section-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .search-controls {
                flex-direction: column;
            }
            
            .search-controls input,
            .search-controls button {
                width: 100%;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}