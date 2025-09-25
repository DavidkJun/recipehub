const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

const dataPath = path.join(__dirname, 'data', 'recipes.json');

const readRecipes = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeRecipes = (recipes) => {
    fs.writeFileSync(dataPath, JSON.stringify(recipes, null, 2));
};

app.get('/api/recipes', (req, res) => {
    const recipes = readRecipes();
    res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
    const recipes = readRecipes();
    const newRecipe = {
        id: Date.now().toString(),
        ...req.body
    };
    recipes.push(newRecipe);
    writeRecipes(recipes);
    res.json(newRecipe);
});

app.delete('/api/recipes/:id', (req, res) => {
    const recipes = readRecipes();
    const filteredRecipes = recipes.filter(recipe => recipe.id !== req.params.id);
    writeRecipes(filteredRecipes);
    res.json({ message: 'Recipe deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});