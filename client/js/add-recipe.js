document.addEventListener('DOMContentLoaded', function() {
    const addRecipeForm = document.getElementById('addRecipeForm');

    addRecipeForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('recipeName').value;
        const category = document.getElementById('recipeCategory').value;
        const cookingTime = document.getElementById('cookingTime').value;
        const ingredientsText = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;

        const ingredients = ingredientsText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');

        const newRecipe = {
            name,
            category,
            cookingTime: cookingTime + ' хв',
            ingredients,
            instructions
        };

        try {
            const response = await fetch('http://localhost:3000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecipe)
            });

            if (response.ok) {
                alert('Рецепт успішно додано!');
                addRecipeForm.reset();
                window.location.href = 'recipes.html';
            } else {
                throw new Error('Помилка при додаванні рецепту');
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Помилка при додаванні рецепту. Спробуйте ще раз.');
        }
    });
});