"use strict";

// Function to fetch movies, handle loading, and display movie list
function fetchMoviesAndHandleLoading() {
    const loadingMessage = document.getElementById("loading-message")
    showLoadingMessage(loadingMessage)
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

/*document.querySelector("#edit-select").addEventListener("change", async (e) => {
    const movieId = e.target.value;
    fetch("http://localhost:3000/movies/" + movieId)
        .then(resp => resp.json())
        .then(movie => {
            document.querySelector("#editMovieTitle").value = movie.title;
            document.querySelector("#editMovieRating").value = movie.rating;
            document.querySelector("#editMovieSummary").value = movie.summary;
        })
        .catch(error => console.error('Error fetching movie details', error));

});*/
document.forms.editForm.addEventListener("submit", async e => {
    e.preventDefault();
    const movieID = document.querySelector("#movieId").value;
    const title = document.querySelector("#editMovieTitle").value;
    const rating = document.querySelector("#editMovieRating").value;
    const summary = document.querySelector("#editMovieSummary").value;
    await editMovie(movieID, {title, rating, summary});

    fetch("http://localhost:3000/movies")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            renderMovies(data)
        })
    /*Render movie function*/
});

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
    }).then(r => {
        fetch("http://localhost:3000/movies")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                renderMovies(data)
            })
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
    <button id="myBtn">Edit</button>
    <button>Delete</button>
    </div>
    `

    card.lastElementChild.children[3].addEventListener('click', (e) => {
        let modal = document.querySelector("#myModal")
        modal.style.display = "block";

        document.querySelector("#editMovieTitle").value = title;
        document.querySelector("#editMovieRating").value = rating;
        document.querySelector("#editMovieSummary").value = summary;
        document.querySelector("#movieId").value = id;
    })
    card.lastElementChild.children[4].addEventListener('click', () => {
        fetch(`http://localhost:3000/movies/${id}`, {method: "DELETE"}).then(r => {
            fetch("http://localhost:3000/movies")
                .then(response => response.json())
                .then(data => {
                    renderMovies(data)
                })
        })
    })

    document.querySelector("#movie-list").append(card)
}

/*fetch("http://localhost:3000/movies").then(resp => resp.json()).then(data => {
        console.log(data);
        renderMovies(data);
    }
)*/

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    } if (event.target === document.querySelector("#navModal")){
        closeModal();
    }
};
// Navbar Modal
function openModal() {
    document.getElementById("navModal").style.display = "flex";
}
function closeModal() {
    document.getElementById("navModal").style.display = "none";
}
// End NavBar Modal

/*http://www.omdbapi.com/?t=${searchTitle}&apikey=${OMDB_KEY}*/