import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/BookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0. Update results view to mark selected search result
    resultsView.update(model.getSearchResults());

    //1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2.Loading the data
    await model.loadRecipe(id);

    //3. rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    console.error(`${err} 😁😀😀`);

    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1.Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //2.Load search results
    await model.loadSearchResults(query);

    //3. render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResults());

    //4. Render initial pagination buttons
    paginationView.render(model.state.search);
    // console.log(model.state.search.resultPerPage);
  } catch (err) {
    console.error(`${err} 😁😀😀`);

    //console.log(err);
  }
};
const controlPagination = function (gotoPage) {
  // console.log('fjdnmvcm');

  //3. render NEW results
  // console.log(model.state.search.results);
  resultsView.render(model.getSearchResults(gotoPage));

  //4. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  ///1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. Update recipe view
  recipeView.update(model.state.recipe);

  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show Loading Spinner
    addRecipeView.renderSpinner();
    // console.log(newRecipe);

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    //Change ID in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);


    //Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err, "😀");
    addRecipeView.renderError(err.message);
  }
  ///Upload the new recipe data;
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();
