// main.js

// CONSTANTS
// URL基本内容格式，以https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json为例：
// {
//   "imgSrc": "https://introweb.tech/assets/images/recipes/1_50-thanksgiving-side-dishes.jpeg",
//   "imgAlt": "Mashed potatoes on table",
//   "titleLnk": "https://www.loveandlemons.com/thanksgiving-side-dishes/",
//   "titleTxt": "50 Thanksgiving Side Dishes: Easy Mashed Potatoes",
//   "organization": "Love and Lemons",
//   "rating": 5,
//   "numRatings": 13,
//   "lengthTime": "1 hr 10 min",
//   "ingredients": "Roasted garlic, yukon gold, rosemary, butter, olive oil"
// }
const RECIPE_URLS = [
  'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
  'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
  'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
  'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // EXPLORE - START (All explore numbers start with B)
  /*******************/
  // ServiceWorkers have many uses, the most common of which is to manage
  // local caches, intercept network requests, and conditionally serve from
  // those local caches. This increases performance since users aren't
  // re-downloading the same resources every single page visit. This also allows
  // websites to have some (if not all) functionality offline! I highly
  // recommend reading up on ServiceWorkers on MDN before continuing.
  /*******************/
  // We first must register our ServiceWorker here before any of the code in
  // sw.js is executed.
  // B1. TODO - Check if 'serviceWorker' is supported in the current browser
  // 这个网页有例子：https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers
  // const registerServiceWorker = async () => { if ("serviceWorker" in navigator) { try ...
  if ('serviceWorker' in navigator) {
    // B2. TODO - Listen for the 'load' event on the window object.
    window.addEventListener('load', function(){
      // Steps B3-B6 will be *inside* the event listener's function created in B2
      // B3. TODO - Register './sw.js' as a service worker (The MDN article
      //            "Using Service Workers" will help you here)
      navigator.serviceWorker.register('/sw.js')
      // well, this is actually a promise? 
      // 第一个函数是 Promise 成功解析（即 Service Worker 成功注册）时要调用的。
      // 第二个函数是 Promise 被拒绝（即 Service Worker 注册失败）时要调用的。
      .then((success) => {
      // B4. TODO - Once the service worker has been successfully registered, console
      //            log that it was successful.
        console.log("register success. 注册成功了。");
      })
      .catch((getError) => {
      // B5. TODO - In the event that the service worker registration fails, console
      //            log that it has failed.
        console.log("register failed。");
      });
      // STEPS B6 ONWARDS WILL BE IN /sw.js
    });
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // EXPOSE - START (All expose numbers start with A)

  // 首先打开网页，去devTool，Application，storage，清空localStorage
  // 上一次lab留下来的数据还在那里，要清除，不然localStorage不为空，不会显示这个lab的item



  // A1. TODO - Check local storage to see if there are any recipes.
  //            If there are recipes, return them.
  let localStorageRecipes = localStorage.getItem('recipes')
  if (localStorageRecipes){
    // 因为提到了要(parsed, not in string form)
    return JSON.parse(localStorageRecipes);
  }
  /**************************/
  // The rest of this method will be concerned with requesting the recipes
  // from the network
  // A2. TODO - Create an empty array to hold the recipes that you will fetch
  let recipes = [];
  // A3. TODO - Return a new Promise. If you are unfamiliar with promises, MDN
  //            has a great article on them. A promise takes one parameter - A
  //            function (we call these callback functions). That function will
  //            take two parameters - resolve, and reject. These are functions
  //            you can call to either resolve the Promise or Reject it.
  return new Promise(async (resolve, reject) => {
    /**************************/
    // A4-A11 will all be *inside* the callback function we passed to the Promise
    // we're returning
    /**************************/
    // A4. TODO - Loop through each recipe in the RECIPE_URLS array constant
    //            declared above
    let i = 0;
    // for (let i=0; i<RECIPE_URLS.length; i++ ){
    for (let recipe_url of RECIPE_URLS){
      // let recipe_url = RECIPE_URLS[i];
      i = i + 1;
      // A5. TODO - Since we are going to be dealing with asynchronous code, create
      //            a try / catch block. A6-A9 will be in the try portion, A10-A11
      //            will be in the catch portion.
      try{
        // A6. TODO - For each URL in that array, fetch the URL - MDN also has a great
        //            article on fetch(). NOTE: Fetches are ASYNCHRONOUS, meaning that
        //            you must either use "await fetch(...)" or "fetch.then(...)". This
        //            function is using the async keyword so we recommend "await"
        let response = await fetch(recipe_url);
        // A7. TODO - For each fetch response, retrieve the JSON from it using .json().
        //            NOTE: .json() is ALSO asynchronous, so you will need to use
        //            "await" again
        let currentRecipe = await response.json();
        // A8. TODO - Add the new recipe to the recipes array
        recipes.push(currentRecipe);
        // A9. TODO - Check to see if you have finished retrieving all of the recipes,
        //            if you have, then save the recipes to storage using the function
        //            we have provided. Then, pass the recipes array to the Promise's
        //            resolve() method.
        // function provided: saveRecipesToStorage(recipes)
        if (i == RECIPE_URLS.length){
          saveRecipesToStorage(recipes);
          // pass the recipes array to the Promise's resolve() method.
          resolve(recipes);
        }
      } catch (e){
        // A10. TODO - Log any errors from catch using console.error
        console.error(e);
        // A11. TODO - Pass any errors to the Promise's reject() function
        reject(e);
      }
    }// end of for loop
  }); // end of A3
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
