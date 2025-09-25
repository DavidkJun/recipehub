document.addEventListener('DOMContentLoaded', function() {
    const addRecipeForm = document.getElementById('addRecipeForm');

    function saveRecipeToLocal(newRecipe) {
        const currentRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');

        currentRecipes.push(newRecipe);

        localStorage.setItem('recipes', JSON.stringify(currentRecipes));

        return newRecipe;
    }

    function validateForm(formData) {
        if (!formData.name.trim()) {
            alert('Будь ласка, введіть назву рецепту');
            return false;
        }

        if (!formData.category) {
            alert('Будь ласка, оберіть категорію');
            return false;
        }

        if (!formData.cookingTime || formData.cookingTime < 1) {
            alert('Будь ласка, введіть коректний час приготування');
            return false;
        }

        if (!formData.ingredients.trim()) {
            alert('Будь ласка, введіть інгредієнти');
            return false;
        }

        if (!formData.instructions.trim()) {
            alert('Будь ласка, введіть інструкції приготування');
            return false;
        }

        return true;
    }

    addRecipeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('recipeName').value,
            category: document.getElementById('recipeCategory').value,
            cookingTime: document.getElementById('cookingTime').value,
            ingredients: document.getElementById('ingredients').value,
            instructions: document.getElementById('instructions').value
        };

        if (!validateForm(formData)) {
            return;
        }

        const newRecipe = {
            id: 'local-' + Date.now().toString(),
            name: formData.name.trim(),
            category: formData.category,
            cookingTime: formData.cookingTime + ' хв',
            ingredients: formData.ingredients.split('\n')
                .map(line => line.trim())
                .filter(line => line !== ''),
            instructions: formData.instructions.trim()
        };

        try {
            saveRecipeToLocal(newRecipe);

            alert('Рецепт успішно додано!');

            addRecipeForm.reset();

            setTimeout(() => {
                window.location.href = 'recipes.html';
            }, 1000);

        } catch (error) {
            console.error('Помилка при додаванні рецепту:', error);
            alert('Сталася помилка при додаванні рецепту. Спробуйте ще раз.');
        }
    });

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Очистити форму';
    clearButton.className = 'btn-secondary';
    clearButton.style.marginLeft = '10px';

    clearButton.addEventListener('click', function() {
        if (confirm('Очистити всі поля форми?')) {
            addRecipeForm.reset();
        }
    });

    const submitButton = addRecipeForm.querySelector('button[type="submit"]');
    submitButton.parentNode.appendChild(clearButton);
});