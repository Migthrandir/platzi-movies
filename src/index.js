const api = axios.create({
    baseURL: 'http://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        api_key: API_KEY,
    },
});

//Utils

function createMovies (section, moviesData) {
    section.innerHTML = "";

    moviesData.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'http://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        section.appendChild(movieContainer);
     });
}

function createCategories (section, categoriesData) {
    section.innerHTML = "";

    categoriesData.forEach(category => {
       

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        })
        categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        section.appendChild(categoryContainer);
     });
}

//Llamados a la API

async function getTrendingMoviesPreview() {
    const {data} = await api('/trending/movie/day');
    const movies = data.results;
    
    createMovies(trendingMoviesPreviewList, movies);
}

async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    createCategories(categoriesPreviewList, categories);
 
}

async function getMoviesByCategories(id) {
    const {data} = await api('/discover/movie', {
        params:{
            with_genres: id,
        }
    });
    const movies = data.results;
    
    createMovies(genericSection, movies);
}

async function getMoviesbySearch(query) {
    const {data} = await api('/search/movie', {
        params:{
            query,
        }
    });
    const movies = data.results;
    
    createMovies(genericSection, movies);
}

async function getTrendingMovies() {
    const {data} = await api('/trending/movie/day');
    const movies = data.results;
    
    createMovies(genericSection, movies);
}

async function getMovieById(id) {
    const {data: movie} = await api('/movie/' + id);
    
    const movieImgUrl = 'http://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0)29.17%
        ),
        url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movieDetailCategoriesList, movie.genres);

    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
    const {data} = await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMoviesContainer, relatedMovies);

}