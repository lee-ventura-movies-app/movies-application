"use strict";
import {OMDB_KEY} from "./keys";
import { getMovies, createMovie, editMovie, deleteMovie } from './movies-api.js';

(() => {
    let currentSortOption = "title";/*The current movie sorting*/
    let sortReversed = false;

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

    updateMovies()

    document.forms.editForm.addEventListener("submit", async e => {
        e.preventDefault();
        const movieID = document.querySelector("#movieId").value;
        const title = document.querySelector("#editMovieTitle").value;
        const rating = document.querySelector("#editMovieRating").value;
        const summary = document.querySelector("#editMovieSummary").value;
        const genre = document.querySelector("#editMovieGenre").value;
        await editMovie(movieID, {title, rating, summary, genre});
        updateMovies()
        document.querySelector('#editModal').style.display = "none"
    });

    document.forms.addMovie.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log()
        if (document.querySelector("#addMovieAuto").value.trim() !== "") {
            let title = document.querySelector("#addMovieAuto").value
            fetch(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_KEY}`).then(resp => resp.json()).then(data => {
                return {
                    "title": `${data.Title}`,
                    "rating": `${parseFloat(data.imdbRating) / 2}`,
                    "summary": `${data.Plot}`,
                    "poster": `${data.Poster}`,
                    "genre": `${data.Genre}`
                }
            }).then(resp => {
                createMovie(resp)
                    .then(() => {
                        updateMovies()
                        document.querySelector("#addMovieAuto").value = "";
                    })
            })
        } else {
            console.log("Movie Not added")
        }
    })
    document.forms.addMovieManual.addEventListener('submit', (e) => {
        e.preventDefault();
        let title = document.querySelector('#newMovieTitle').value
        fetch(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_KEY}`).then(resp => resp.json()).then(data => {
            let newMovie = {
                "title": `${document.querySelector('#newMovieTitle').value}`,
                "rating": `${document.querySelector('#newMovieRating').value}`,
                "summary": `${document.querySelector('#newMovieSummary').value}`,
                "poster": `${data.Poster}`,
                "genre": `${document.querySelector('#newMovieGenre').value}`
            }
        }).then(resp => {
            createMovie(resp)
                .then(() => {
                    updateMovies()
                    document.querySelector('#newMovieTitle').value = "";
                    document.querySelector('#newMovieRating').value = "";
                    document.querySelector('#newMovieSummary').value = "";
                    document.querySelector('#newMovieGenre').value = "";
                    document.querySelector("#addMovieMsg").innerText = "Movie Added";
                })
        })
    })

    document.forms.filterMoviesForm.addEventListener('submit', (e) => {
        e.preventDefault()
        updateMovies()
    })

    document.querySelector("#filterByRating").addEventListener('change', () => {
        updateMovies()
    })
    document.querySelector("#filterByGenre").addEventListener('change', () => {
        updateMovies()
    })
    document.querySelector("#sortByTitle").addEventListener('click', () => {
        currentSortOption = "title";
        updateMovies()
    })
    document.querySelector("#sortByRating").addEventListener('click', () => {
        currentSortOption = "rating";
        updateMovies();
    })
    document.querySelector("#reverseSorting").addEventListener('click', () => {
        sortReversed = sortReversed === false;
        updateMovies()
    })

    // When the user clicks on <span> (x), close the modal
    document.querySelectorAll(".close")[0].onclick = function () {
        document.querySelector('#editModal').style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === document.querySelector('#editModal')) {
            document.querySelector('#editModal').style.display = "none";
        }
        if (event.target === document.querySelector("#navModal")) {
            document.getElementById("navModal").style.display = "none";
        }
    };

    // Navbar Modal
    document.querySelector("#movie-add").addEventListener('click', () => {
        document.getElementById("navModal").style.display = "flex"
    })

    document.querySelector("#closeNavModal").addEventListener('click', () => {
        document.getElementById("navModal").style.display = "none"
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
        let rating = parseFloat(movie.rating);
        let summary = movie.summary;
        let id = movie.id;
        let poster = movie.poster;
        let genre = movie.genre;
        card.classList.add("movie-card")
        card.innerHTML = `
        <div class="img-con">
        <img alt="" src=${poster}>
        </div>
        <div class="mov-details swing-in-top-fwd">
             <div>
                <h3>${title}</h3>
<!--                <p>Rating: ${rating}</p>-->
                ${addStarRating(parseFloat(rating), 5).innerHTML}
            </div>
            <p>${genre}</p>
            <div>
            <p>${summary}</p>
            </div>
            <button>Edit</button>
            <button>Delete</button>
        </div>
        `
        card.lastElementChild.lastElementChild.previousElementSibling.addEventListener('click', (e) => {
            let modal = document.querySelector("#editModal")
            modal.style.display = "block";
            document.querySelector("#editMovieTitle").value = title;
            document.querySelector("#editMovieRating").value = rating;
            document.querySelector("#editMovieGenre").value = genre;
            document.querySelector("#editMovieSummary").value = summary;
            document.querySelector("#movieId").value = id;
        })

// Function to show the delete confirmation modal
        function showDeleteModal(movieID) {
            const modal = document.getElementById("deleteModal");
            modal.style.display = "block";

            // Set the movie ID to a data attribute for later use
            modal.setAttribute("data-movie-id", movieID);
        }

// Function to hide the delete confirmation modal
        function hideDeleteModal() {
            const modal = document.getElementById("deleteModal");
            modal.style.display = "none";
        }

// Event listener for the "Delete" button inside createMovieCard
        card.lastElementChild.lastElementChild.addEventListener('click', (e) => {
            e.preventDefault();
            const movieID = id; // Assuming 'id' is the unique identifier for the movie
            showDeleteModal(movieID);
        });

// Event listener for the "Yes" button in the delete modal
        document.getElementById("confirmDelete").addEventListener('click', () => {
            const movieID = document.getElementById("deleteModal").getAttribute("data-movie-id");
            hideDeleteModal();
            deleteMovie(movieID)
                .then(() => {
                    updateMovies();
                });
        });

// Event listener for the "No" button in the delete modal
        document.getElementById("cancelDelete").addEventListener('click', () => {
            hideDeleteModal();
        });

// Event listener for closing the delete modal
        document.getElementById("closeDeleteModal").addEventListener('click', () => {
            hideDeleteModal();
        });


        for (let i of card.children[1].children[0].children[1].children) {
            i.addEventListener("mouseenter", () => {
                i.classList.toggle("selected-rating")
            })
            i.addEventListener("mouseleave", () => {
                i.classList.toggle("selected-rating")
            })
        }
        document.querySelector("#movie-list").append(card)
    }

    function updateMovies() {
        /* e.preventDefault(); // Prevent form submission*/
        document.querySelector("#movie-list").innerHTML = "";
        /*variables might need to be in global scope to function*/
        let movieRatingFilter = document.querySelector("#filterByRating").value;/*Rating number to be sorted by*/
        let movieGenreFilter = document.querySelector("#filterByGenre").value.toLowerCase();/*Filter By selected Genre*/
        let movieTitleFilter = document.querySelector("#searchMovieByTitle").value.toLowerCase();/*Filter by the title*/
        let filteredMovies = [];/*movie array to be rendered*/

        // Filter movies By name or rating/
        getMovies().then(movies => {
            filteredMovies = filterMovies(movies, [
                filterByTitle(movieTitleFilter),
                filterByRating(movieRatingFilter, movieRatingFilter + 1),
                filterByGenre(movieGenreFilter)
            ])
        }).then(() => {
            /*For sorting by name or rating*/
            switch (currentSortOption) {
                case "title":
                    filteredMovies.sort(function (a, b) {
                        let x = a.title.toLowerCase();
                        let y = b.title.toLowerCase();
                        if (x < y) {
                            return -1;
                        }
                        if (x > y) {
                            return 1;
                        }
                        return 0;
                    })
                    break;
                case "rating":
                    filteredMovies.sort((a, b) => {
                        const ratingA = parseFloat(a.rating);
                        const ratingB = parseFloat(b.rating);
                        return ratingB - ratingA; // Sort in descending order by rating
                    });
                    break;
                case "genre":
                    filteredMovies.sort((a, b) => {
                        const genreA = a.genre.toLowerCase();
                        const genreB = b.genre.toLowerCase();
                        if (genreA < genreB) {
                            return -1;
                        }
                        if (genreA > genreB) {
                            return 1;
                        }
                        return 0;
                    });
                    break;
            }
            if (sortReversed === true) {
                filteredMovies = filteredMovies.reverse()
            }
            return filteredMovies
        }).then(() => {
            renderMovies(filteredMovies)
        })
    }

    /*Event Listeners*/
    updateMovies()

    document.addEventListener("keyup", (e) => {
        if (e.key === "q") {
            updateMovies()
        }
    })

    /*Creates a stackable filter function*/
    function filterMovies(moviesArray, filters) {
        return moviesArray.filter(movie => {
            return filters.every(filter => filter(movie));
        });
    }

    /*-- Creates a filter by title --*/
    function filterByTitle(movieTitle) {
        return movie => movie.title.toLowerCase().includes(movieTitle)
    }

    /*-- creates a filter by rating*/
    function filterByRating(min, max) {
        return movie => (movie.rating >= min && movie.rating < max) || min === "all"
    }

    /*-- creates a filter by genre--*/
    function filterByGenre(genre) {
        return movie => movie.genre.toLowerCase().includes(genre) || genre === "all"
    }

    function addStarRating(rating, maxStars) {
        let starsRating = document.createElement("div")
        let div = document.createElement("div");
        div.classList.add("star-rating")
        for (let i = 1; i <= maxStars; i++) {
            let star = document.createElement("i")
            if (i > rating) {
                star.className = "bx bx-star star"
            }
            if (i > rating && i - 1 < rating - .2) {
                star.className = 'bx bxs-star-half star'
            }
            if (i <= rating + .2) {
                star.className = "bx bxs-star star"
            }
            div.append(star)
        }
        starsRating.append(div)

        // return document.querySelector("body").append(starsRating)
        return starsRating
    }
})()
