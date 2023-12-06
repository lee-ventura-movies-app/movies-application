"use strict";

// Loading message
const loadingMessage = document.getElementById("loading-message");

// Function to fetch movies, handle loading, and display movie list
function fetchMoviesAndHandleLoading() {
    showLoadingMessage(loadingMessage);
    // Fetch from movies.json
    fetch("http://localhost:3000/movies")
        .then(response => response.json())
        .then(function (data) {
            hideLoadingMessage(loadingMessage);
            displayMovies(data);
        })
        .catch(error => {
            hideLoadingMessage(loadingMessage);
            handleFetchError(error);
        });
}
fetchMoviesAndHandleLoading();

// Show loading message
function showLoadingMessage(element) {
    element.style.display = "block";
}
// Hide loading message
function hideLoadingMessage(element) {
    element.style.display = "none";
}

// Function to display movies in the movie-list element
function displayMovies(data) {
    const movieList = document.getElementById('movie-list');
    let result = `<h2> Movies I've watched! </h2>`;
    data.forEach((movie) => {
        const {id, title, rating} = movie;
        result += `
                <div>
                    <h5> Movie ID: ${id} </h5>
                    <ul>
                        <li>Movie title: ${title}</li>
                        <li>Movie rating: ${rating}</li>
                    </ul>
                </div>`;
    });
    movieList.innerHTML = result;
}

// Fetch error
function handleFetchError(error) {
    console.error('Error fetching movies:', error);
    document.getElementById('movie-list').innerHTML = 'Error loading movies. Please try again later.';
}
