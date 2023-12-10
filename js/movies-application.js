"use strict";
(() => {
    let currentSortOption = "";/*The current movie sorting*/
    window.sortMovies = function(sortOption) {
        currentSortOption = sortOption;
        updateMovies();
    };

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
                <p>Rating: ${rating}</p>
                <p>${genre}</p>
            </div>
            <div>
            <p>${summary}</p>
            </div>
            <button id="myBtn">Edit</button>
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

        card.lastElementChild.lastElementChild.addEventListener('click', (e) => {
            e.preventDefault();
            deleteMovie(id)
                .then(() => {
                    updateMovies()
                });
        })


        document.querySelector("#movie-list").append(card)
    }


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
    document.querySelector("#movie-control").addEventListener('click', () => {
        document.getElementById("navModal").style.display = "flex"
    })

    document.querySelector("#closeNavModal").addEventListener('click', () => {
        document.getElementById("navModal").style.display = "none"
    })
// End NavBar Modal

    function updateMovies() {
       /* e.preventDefault(); // Prevent form submission*/
        document.querySelector("#movie-list").innerHTML = "";
        /*variables might need to be in global scope to function*/
        let movieFilterBY = "";/*Decide to filter by name or by rating*/
        let movieRatingFilter = 2;/*Rating number to be sorted by*/
        let movieGenreFilter = "";/*Filter By selected Genre*/
        let movieTitleFilter = "";/*Filter by the title*/
        const filteredMovies = [];/*movie array to be rendered*/

        // Filter movies By name or rating/
        getMovies().then(movies => {
            /*Filters movies by title*/
            movies.forEach((movie) => {
                switch (movieFilterBY) {
                    case "title":
                        if (movie.title.toLowerCase().includes(movieTitleFilter.toLowerCase())) {
                            filteredMovies.push(movie);
                        }
                        break;
                    case "rating":
                        if (parseInt(movie.rating)  === movieRatingFilter){
                            filteredMovies.push(movie)
                        }
                        break; case "genre":
                        if (movie.genre.toLowerCase().includes(movieGenreFilter.toLowerCase())){
                            filteredMovies.push(movie)
                        }
                        break;
                    default: filteredMovies.push(movie)
                }


            });

                return filteredMovies
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
                        return a.id - b.id
                    })
                    break;
            }
            return filteredMovies

        }).then(()=>{renderMovies(filteredMovies)})
    }

    updateMovies()

})()
