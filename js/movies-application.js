"use strict";
(() => {
    const getMovies = fetch("http://localhost:3000/movies").then(response => response.json())


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

    function sortMovies() {
        fetch("http://localhost:3000/movies")
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const movies = data;
                    movies.sort((a, b) => {
                        const titleA = a.title.toUpperCase();
                        const titleB = b.title.toUpperCase();

                        if (titleA < titleB) return -1;
                        if (titleA > titleB) return 1;
                        return 0;
                    });
                    renderMovies(movies);
                } else {
                    console.error('Invalid data structure from the server:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
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

    document.forms.editForm.addEventListener("submit", async e => {
        e.preventDefault();
        const movieID = document.querySelector("#movieId").value;
        const title = document.querySelector("#editMovieTitle").value;
        const rating = document.querySelector("#editMovieRating").value;
        const summary = document.querySelector("#editMovieSummary").value;
        const genre = document.querySelector("#editMovieGenre").value;
        await editMovie(movieID, {title, rating, summary, genre});

        fetch("http://localhost:3000/movies")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                renderMovies(data)

            })

        document.querySelector('#editModal').style.display = "none"
    });

    document.forms.addMovie.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchTitle = document.querySelector("#addMovieAuto").value
        fetch(`http://www.omdbapi.com/?t=${searchTitle}&apikey=${OMDB_KEY}`).then(resp => resp.json()).then(data => {
            let newMovie = {}
            console.log(data)
            if (document.querySelector("#addMovieAuto").value.trim() !== "") {
                newMovie = {
                    "title": `${data.Title}`,
                    "rating": `${parseFloat(data.imdbRating) / 2}`,
                    "summary": `${data.Plot}`,
                    "poster": `${data.Poster}`,
                    "genre": `${data.Genre}`
                }
            }
            console.log(newMovie)
            createMovie(newMovie)
            document.querySelector("#addMovieAuto").value = "";
        }).then(r => {
            fetch("http://localhost:3000/movies")
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setTimeout(()=>{renderMovies(data)}, 500)

                })
        })

    })

    document.forms.addMovieManual.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchTitle = document.querySelector('#newMovieTitle').value
        fetch(`http://www.omdbapi.com/?t=${searchTitle}&apikey=${OMDB_KEY}`).then(resp => resp.json()).then(data => {
            let newMovie = {
                "title": `${document.querySelector('#newMovieTitle').value}`,
                "rating": `${document.querySelector('#newMovieRating').value}`,
                "summary": `${document.querySelector('#newMovieSummary').value}`,
                "poster": `${data.Poster}`,
                "genre": `${document.querySelector('#newMovieGenre').value}`
            }
            createMovie(newMovie)
        })
            .then(r => {
                fetch("http://localhost:3000/movies")
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        renderMovies(data)
                    })

                document.querySelector('#newMovieTitle').value = "";
                document.querySelector('#newMovieRating').value = "";
                document.querySelector('#newMovieSummary').value = "";
                document.querySelector('#newMovieGenre').value = "";
                document.querySelector("#addMovieMsg").innerText = "Added New Movie";
            })
    })

    /*function filterSort(){
        let getMovies = fetch("http://localhost:3000/movies").then(response => response.json())
        let filteredMovies = []




    }*/

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

        card.lastElementChild.lastElementChild.addEventListener('click', () => {
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

    function firstLetterUpperCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
})()
