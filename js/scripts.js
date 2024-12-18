
const apiKey = 'ec533c637809479ab4a7acdb6e4b17ea'; 
const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';


const searchInput = document.querySelector('input[type="text"]');
const recipeList = document.getElementById('recipeList');
const favoritoList = document.getElementById('favoritolist');


function searchRecipes(query) {
    const url = `${baseUrl}?query=${query}&apiKey=${apiKey}&number=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayRecipes(data.results))
        .catch(error => console.error('Error fetching recipes:', error));
}


function displayRecipes(recipes) {
    recipeList.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');

        const recipeImage = recipe.image;
        const recipeTitle = recipe.title;
        const recipeId = recipe.id;


        recipeItem.innerHTML = `
            <img src="${recipeImage}" alt="${recipeTitle}">
            <h3>${recipeTitle}</h3>
            <button onclick="addToFavorites(${recipeId}, '${recipeTitle}', '${recipeImage}')">Agregar a Favoritos</button>
            <button onclick="viewRecipeDetails(${recipeId})">Ver Detalles</button>
        `;

        recipeList.appendChild(recipeItem);
    });
}


function viewRecipeDetails(id) {
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalIngredients').textContent = data.extendedIngredients.map(ingredient => ingredient.name).join(', ');
            document.getElementById('modalSteps').textContent = data.analyzedInstructions[0]?.steps.map(step => step.step).join('\n');
            document.getElementById('recipeModal').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching recipe details:', error));
}

function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

function addToFavorites(id, title, image) {
   
    const existingFavorites = Array.from(favoritoList.querySelectorAll('li'));
    const alreadyFavorited = existingFavorites.some(item => {
        const itemTitle = item.querySelector('span').textContent;
        return itemTitle === title;
    });

    if (alreadyFavorited) {
       
        alert('Esta receta ya está en la lista de favoritos.');
        return; 
    }

    
    const favoriteItem = document.createElement('li');
    favoriteItem.innerHTML = `
        <img src="${image}" alt="${title}" width="50">
        <span>${title}</span>
        <button onclick="viewRecipeDetails(${id})">Ver Detalles</button>
        <button onclick="removeFromFavorites(this)">Eliminar</button>
    `;

    favoritoList.appendChild(favoriteItem);
    saveFavorites();
}

function removeFromFavorites(button) {
    button.parentElement.remove();
    saveFavorites(); 
}


function saveFavorites() {
    const favorites = [];
    const items = favoritoList.querySelectorAll('li');
    items.forEach(item => {
        const title = item.querySelector('span').textContent;
        const image = item.querySelector('img').src;
        favorites.push({ title, image });
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
}


function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(fav => {
        const favoriteItem = document.createElement('li');
        favoriteItem.innerHTML = `
            <img src="${fav.image}" alt="${fav.title}" width="50">
            <span>${fav.title}</span>
            <button onclick="removeFromFavorites(this)">Eliminar</button>
        `;
        favoritoList.appendChild(favoriteItem);
    });
}


window.onload = loadFavorites;


searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query) {
        searchRecipes(query);
    } else {
        recipeList.innerHTML = ''; 
    }
});
