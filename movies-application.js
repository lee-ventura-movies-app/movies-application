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
    console.log(data)
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


const createMovie = async (movie) => {
    try {
        const url = 'http://localhost:3000/movies';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        };
        const response = await fetch(url, options);
        const newMovie = await response.json();
        return newMovie;
    } catch (error) {
        console.error(error);
    }
    createMovie(newMovie).then(() => fetch("http://localhost:3000/movies")).then(resp => resp.json()).then(data => console.log(data));
}
const editMovie = async (id, movie) => {
    try {
        const url = `http://localhost:3000/movies/${id}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        };
        const response = await fetch(url, options);
        const newMovie = await response.json();
        return newMovie;
    } catch (error) {
        console.error(error);
    }
}

function populateDropDown() {
    fetch("http://localhost:3000/movies")
        .then(resp => resp.json())
        .then(data => {
        console.log(data);
        const dropDown = document.getElementById("edit-select");
        for (let movie of data) {
            const option = document.createElement("option");
            option.value = movie.id;
            option.innerText = movie.title;
            dropDown.appendChild(option);
        }
    })
        .catch(error => console.error('Error fetching movies', error));
}

document.querySelector("#edit-select").addEventListener("change", async (e) => {
    const movieId = e.target.value;
    fetch("http://localhost:3000/movies/" + movieId)
        .then(resp => resp.json())
        .then(movie => {
        document.querySelector("#editMovieTitle").value = movie.title;
        document.querySelector("#editMovieRating").value = movie.rating;
        document.querySelector("#editMovieSummary").value = movie.movieSummary;
    })
        .catch(error => console.error('Error fetching movie details', error));

});
document.forms.editForm.addEventListener("submit", async e => {
    e.preventDefault();
    const movieID = document.querySelector("#edit-select").value;
    const title = document.querySelector("#editMovieTitle").value;
    const rating = document.querySelector("#editMovieRating").value;
    const movieSummary = document.querySelector("#editMovieSummary").value;
    // editMovie(movieID, {title, rating, movieSummary});
    try {
        await editMovie(movieID, { title, rating, movieSummary });
        populateDropDown();
    } catch (error) {
        console.error('Error editing movie:', error);
    }});

document.querySelector("#addMovieSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    alert("fff")
    const newMovie = {
        "title": document.querySelector("#new-movieTitle").value,
        "rating": document.querySelector("#new-movieRating").value,
        "movieSummary": document.querySelector("#new-movieSummary").value,
    }
})

