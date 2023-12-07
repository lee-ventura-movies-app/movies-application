"use strict";


// Loading message
const loadingMessage = document.getElementById("loading-message");

// Function to fetch movies, handle loading, and display movie list
function fetchMoviesAndHandleLoading() {
    showLoadingMessage(loadingMessage);
    // Fetch from movies.json
    fetch("http://localhost:3000/movies")
        .then(response => response.json())
        .then(data => {
            renderMovies(data)
            hideLoadingMessage(loadingMessage);
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


document.querySelector("#edit-select").addEventListener("change", async (e) => {
    const movieId = e.target.value;
    fetch("http://localhost:3000/movies/" + movieId)
        .then(resp => resp.json())
        .then(movie => {
            document.querySelector("#editMovieTitle").value = movie.title;
            document.querySelector("#editMovieRating").value = movie.rating;
            document.querySelector("#editMovieSummary").value = movie.summary;
        })
        .catch(error => console.error('Error fetching movie details', error));

});
document.forms.editForm.addEventListener("submit", async e => {
    e.preventDefault();
    const movieID = document.querySelector("#edit-select").value;
    const title = document.querySelector("#editMovieTitle").value;
    const rating = document.querySelector("#editMovieRating").value;
    const summary = document.querySelector("#editMovieSummary").value;
    editMovie(movieID, {title, rating, summary});

    /*Render movie function*/
});

/*
document.forms.editForm.addEventListener("submit", async e => {
    e.preventDefault();
    const movieID = 4;
    const title = "Diff Title";
    const rating = "2";
    const movieSummary = "new summary";
    // editMovie(movieID, {title, rating, movieSummary});
    try {
        await editMovie(movieID, { title, rating, movieSummary });
        populateDropDown();
    } catch (error) {
        console.error('Error editing movie:', error);
    }});
*/


document.querySelector("#addMovieSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    let searchTitle = prompt("Add a Movie")
    fetch(`http://www.omdbapi.com/?t=${searchTitle}&apikey=${OMDB_KEY}`).then(resp => resp.json()).then(data => {
        console.log(data)

        const newMovie = {
            "title": `${data.Title}`,
            "rating": `${data.Ratings[0].Value}`,
            "summary": `${data.Plot}`,
            "poster": `${data.Poster}`,
        }
        createMovie(newMovie)
        renderMovies()

    })

})

/*Renders movie cards*/
function renderMovies(movies) {
    document.querySelector("#movie-list").innerHTML = "";

    for (let movie of movies) {
        createMovieCard(movie)
    }

}


/*Creates a new movie card*/
function createMovieCard(movie) {
    let card = document.createElement("div");
    let title = movie.title;
    let rating = movie.rating;
    let summary = movie.summary;
    let id = movie.id
    let poster = movie.poster

    card.classList.add("movie-card")
    card.innerHTML = `
    <img alt="" src=${poster}>
    <div class="mv-details">
     <h3>${title}</h3>
    <p>Rating: ${rating}</p>
    <p>${summary}</p>
    <button>Edit</button>
    </div>
   
    `
    card.lastElementChild.addEventListener('click', () => {
        console.log(id)
    })


    document.querySelector("#movie-list").append(card)
}

fetch("http://localhost:3000/movies").then(resp => resp.json()).then(data => {
        console.log(data);
        renderMovies(data);
    }
)


/*http://www.omdbapi.com/?t=${searchTitle}&apikey=${OMDB_KEY}*/