function searchRecipes(){
    const searchInput = document.getElementById("searchInput").value;
    const recipeContainer = document.getElementById("recipe-container");
    const notFoundContainer = document.getElementById("recipe-notFound");

    if(searchInput.trim() === ''){
        notFoundContainer.innerHTML = `Please enter a recipe name to search!`;
        notFoundContainer.style.display = 'block';
        recipeContainer.innerHTML = ''; // clear previous results too
        return;
    }

    // clear previous results & hide error message
    recipeContainer.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`).then(response => response.json())
    .then(data=>{
        
        //console.log("Data received:", data); 

        if(!data.meals){
            notFoundContainer.innerHTML = `Recipe not found!, please try another search.`;
            notFoundContainer.style.display= 'block';
            recipeContainer.innerHTML = '';
        }
        else{
            data.meals.forEach(meal => {
                const card = document.createElement('div');
                card.classList.add('recipe-card');

                card.innerHTML=`
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2>${meal.strMeal}</h2>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>`;
                
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                button.addEventListener("click", () => viewRecipe(meal.idMeal));
                card.appendChild(button);
                recipeContainer.appendChild(card);
            });
        }
        //console.log("Data received:", data);
    })
}

// Fetching Recipe Details
function viewRecipe(mealId) {
    const recipeDetailsContent = document.getElementById("recipe-details-content");
    const recipeTitle = document.getElementById("recipeTitle");
    const recipeDetails = document.getElementById("recipeDetails");

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response=> response.json())
    .then(data => {
        const meal = data.meals[0];
        recipeTitle.innerText = meal.strMeal;

        recipeDetails.innerHTML = `
        <div class="Ingredients">
            <h3>Ingredients: </h3>
            <ul>${fetchIngredients(meal)}</ul>
        </div>    
        <div class="Instructions">    
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        `;
        recipeDetailsContent.style.display= 'block';
    });
}

// Fetching Ingredients

function fetchIngredients(meal){
    let ingredientList="";
    for(let i=1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`;
        }
        else{
            break;
        }
    }
    return ingredientList;
}

function closeRecipe(){
    document.getElementById('recipe-details-content').style.display='none';
}