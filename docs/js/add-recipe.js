document.addEventListener('DOMContentLoaded', function() {
    const addRecipeForm = document.getElementById('addRecipeForm');
    const recipeNameInput = document.getElementById('recipeName');

    function validateRecipeName(name) {
        name = name.trim();

        if (name === '') {
            return {
                isValid: false,
                message: 'Назва рецепту не може бути порожньою'
            };
        }

        if (name.length < 2) {
            return {
                isValid: false,
                message: 'Назва рецепту повинна містити щонайменше 2 символи'
            };
        }

        if (name.length > 100) {
            return {
                isValid: false,
                message: 'Назва рецепту не може перевищувати 100 символів'
            };
        }

        const htmlTagRegex = /<[^>]*>/;
        if (htmlTagRegex.test(name)) {
            return {
                isValid: false,
                message: 'Назва рецепту не може містити HTML теги'
            };
        }

        const dangerousCharsRegex = /[<>{}[\]]/;
        if (dangerousCharsRegex.test(name)) {
            return {
                isValid: false,
                message: 'Назва рецепту містить заборонені символи'
            };
        }

        const validCharsRegex = /^[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9\s\-',.!?]+$/;
        if (!validCharsRegex.test(name)) {
            return {
                isValid: false,
                message: 'Назва рецепту містить недопустимі символи'
            };
        }

        return {
            isValid: true,
            message: 'Назва валідна',
            cleanedName: name
        };
    }

    function showError(input, message) {
        hideError(input);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.3rem';

        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
    }

    // Функція для приховання помилки
    function hideError(input) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('error');
    }

    // Функція для відображення успіху
    function showSuccess(input) {
        hideError(input);
        input.classList.add('success');
    }

    // Функція для очищення статусу
    function clearStatus(input) {
        hideError(input);
        input.classList.remove('success');
        input.classList.remove('error');
    }

    // Функція для очищення HTML тегів
    function sanitizeInput(text) {
        return text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Функція для валідації інгредієнтів
    function validateIngredients(ingredientsText) {
        const ingredients = ingredientsText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');

        if (ingredients.length === 0) {
            return {
                isValid: false,
                message: 'Додайте щонайменше один інгредієнт'
            };
        }

        // Перевірка кожного інгредієнта
        for (let ingredient of ingredients) {
            const validation = validateRecipeName(ingredient);
            if (!validation.isValid) {
                return {
                    isValid: false,
                    message: `Недійсний інгредієнт: ${validation.message}`
                };
            }
        }

        return {
            isValid: true,
            message: 'Інгредієнти валідні',
            cleanedIngredients: ingredients.map(ing => sanitizeInput(ing))
        };
    }

    // Функція для валідації інструкцій
    function validateInstructions(instructions) {
        instructions = instructions.trim();

        if (instructions === '') {
            return {
                isValid: false,
                message: 'Інструкції не можуть бути порожніми'
            };
        }

        if (instructions.length < 10) {
            return {
                isValid: false,
                message: 'Інструкції повинні містити щонайменше 10 символів'
            };
        }

        // Очищаємо від HTML тегів
        const cleanedInstructions = sanitizeInput(instructions);

        return {
            isValid: true,
            message: 'Інструкції валідні',
            cleanedInstructions: cleanedInstructions
        };
    }

    // Функція для збереження рецепту в localStorage
    function saveRecipeToLocal(newRecipe) {
        // Отримуємо поточні рецепти з localStorage
        const currentRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');

        // Перевіряємо на дублікати
        const isDuplicate = currentRecipes.some(recipe =>
            recipe.name.toLowerCase() === newRecipe.name.toLowerCase()
        );

        if (isDuplicate) {
            throw new Error('Рецепт з такою назвою вже існує');
        }

        // Додаємо новий рецепт
        currentRecipes.push(newRecipe);

        // Зберігаємо оновлений список назад у localStorage
        localStorage.setItem('recipes', JSON.stringify(currentRecipes));

        return newRecipe;
    }

    // Функція для валідації всієї форми
    function validateForm(formData) {
        // Валідація назви
        const nameValidation = validateRecipeName(formData.name);
        if (!nameValidation.isValid) {
            showError(recipeNameInput, nameValidation.message);
            recipeNameInput.focus();
            return false;
        }

        // Валідація категорії
        if (!formData.category) {
            alert('Будь ласка, оберіть категорію');
            document.getElementById('recipeCategory').focus();
            return false;
        }

        // Валідація часу приготування
        if (!formData.cookingTime || formData.cookingTime < 1 || formData.cookingTime > 1000) {
            alert('Будь ласка, введіть коректний час приготування (1-1000 хвилин)');
            document.getElementById('cookingTime').focus();
            return false;
        }

        // Валідація інгредієнтів
        const ingredientsValidation = validateIngredients(formData.ingredients);
        if (!ingredientsValidation.isValid) {
            alert(ingredientsValidation.message);
            document.getElementById('ingredients').focus();
            return false;
        }

        // Валідація інструкцій
        const instructionsValidation = validateInstructions(formData.instructions);
        if (!instructionsValidation.isValid) {
            alert(instructionsValidation.message);
            document.getElementById('instructions').focus();
            return false;
        }

        return true;
    }

    // Обробники подій для поля назви
    recipeNameInput.addEventListener('input', function() {
        const validation = validateRecipeName(this.value);
        if (this.value.trim() === '') {
            clearStatus(this);
        } else if (!validation.isValid) {
            showError(this, validation.message);
        } else {
            showSuccess(this);
        }
    });

    recipeNameInput.addEventListener('blur', function() {
        const validation = validateRecipeName(this.value);
        if (!validation.isValid && this.value.trim() !== '') {
            showError(this, validation.message);
        }
    });

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

        const nameValidation = validateRecipeName(formData.name);
        const ingredientsValidation = validateIngredients(formData.ingredients);
        const instructionsValidation = validateInstructions(formData.instructions);

        const newRecipe = {
            id: 'local-' + Date.now().toString(),
            name: nameValidation.cleanedName,
            category: formData.category,
            cookingTime: formData.cookingTime + ' хв',
            ingredients: ingredientsValidation.cleanedIngredients,
            instructions: instructionsValidation.cleanedInstructions
        };

        try {
            saveRecipeToLocal(newRecipe);

            alert('Рецепт успішно додано!');

            addRecipeForm.reset();
            clearStatus(recipeNameInput);

            setTimeout(() => {
                window.location.href = 'recipes.html';
            }, 1000);

        } catch (error) {
            console.error('Помилка при додаванні рецепту:', error);
            alert('Помилка: ' + error.message);
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
            clearStatus(recipeNameInput);
        }
    });

    const submitButton = addRecipeForm.querySelector('button[type="submit"]');
    submitButton.parentNode.appendChild(clearButton);
});