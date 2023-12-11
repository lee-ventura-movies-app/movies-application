async function getMovies() {
    try {
        const moviesUrl = 'http://localhost:3000/movies';
        const moviesResponse = await fetch(moviesUrl);

        return await moviesResponse.json();
    } catch (error) {
        throw new Error("Database failed to retrieve movies!")
    }
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
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function editMovie(id, movie) {
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
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function deleteMovie(id) {
    try {
        const url = `http://localhost:3000/movies/${id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}