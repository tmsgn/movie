const sliderimgs = document.querySelectorAll(".imgslider .img");
const slidegenre = document.querySelector(".genre");
const trendingimg = document.querySelectorAll(".trending img");
const trendingname = document.querySelectorAll(".trending .name");
const trendingyear = document.querySelectorAll(".trending .year");
const trendingGenre = document.querySelectorAll(".trending .genre");
const trendDuration = document.querySelectorAll(".trending .duration");
const latestimg = document.querySelectorAll(".latest img");
const latestname = document.querySelectorAll(".latest .name");
const latestyear = document.querySelectorAll(".latest .year");
const latestGenre = document.querySelectorAll(".latest .genre");
const latestDuration = document.querySelectorAll(".latest .duration");
const tvimg = document.querySelectorAll(".tv img");
const tvname = document.querySelectorAll(".tv .name");
const tvyear = document.querySelectorAll(".tv .year");
const tvGenre = document.querySelectorAll(".tv .genre");
const tvDuration = document.querySelectorAll(".tv .duration");
const title = document.querySelector(".title");
const discription = document.querySelector(".description");
const video = document.querySelector(".video");
const search = document.querySelector(".search");
const input = document.querySelector(".input");
const ul = document.getElementById('suggestion');
const history = document.querySelector('.history');
const historydiv = document.querySelector('.historydiv');
let indexslide = 0;
let imgindex = 0;
let trendingMovies = [];
let latestMovies = [];
let tvshows = [];
let movieGenreList = [];
let tvGenreList = [];
let historys = JSON.parse(localStorage.getItem('historys')) || [];
let watchlists= JSON.parse(localStorage.getItem('watchlists')) || [];

async function getMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=b6a27c41bfadea6397dcd72c3877cac1`);
    const movie = await response.json();
    console.log(movie);
    return movie;
}

async function getTvShowDetails(tvId) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=b6a27c41bfadea6397dcd72c3877cac1`);
    const tvshow = await response.json();
    console.log(tvshow);
    return tvshow;
}

async function getGenreList() {
    try {
        const movieResponse = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=b6a27c41bfadea6397dcd72c3877cac1");
        if (!movieResponse.ok) {
            throw new Error(`HTTP error! status: ${movieResponse.status}`);
        }
        const movieData = await movieResponse.json();
        movieGenreList = movieData.genres;

        const tvResponse = await fetch("https://api.themoviedb.org/3/genre/tv/list?api_key=b6a27c41bfadea6397dcd72c3877cac1");
        if (!tvResponse.ok) {
            throw new Error(`HTTP error! status: ${tvResponse.status}`);
        }
        const tvData = await tvResponse.json();
        tvGenreList = tvData.genres;
    } catch (error) {
        console.error('Error:', error);
    }
}

function getGenreNames(genreIds, isTvShow = false) {
    const genreList = isTvShow ? tvGenreList : movieGenreList;
    const genreNames = genreIds.map(id => {
        const genre = genreList.find(g => g.id === id);
        return genre ? genre.name : '';
    });
    return genreNames.length > 0 ? genreNames[0] : '';
}

async function getTrendingMovies() {
    try {
        const response = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=b6a27c41bfadea6397dcd72c3877cac1");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        trendingMovies = data.results;
        const imgdiv = document.querySelector('.trending .imgdiv');
        imgdiv.innerHTML = ''; 

        const msgs = document.querySelector('.added');
        for (const movie of data.results) {
            const moviediv = document.createElement('div');
            moviediv.classList.add('movie');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
            img.alt = movie.title;

            const name = document.createElement('p');
            name.classList.add('name');
            name.textContent = movie.title;

            const year = document.createElement('p');
            year.classList.add('year');
            year.textContent = movie.release_date.slice(0, 4);

            const genre = document.createElement('p');
            genre.classList.add('genre');
            genre.textContent = getGenreNames(movie.genre_ids);

            const duration = document.createElement('p');
            duration.classList.add('duration');
            const movieDetails = await getMovieDetails(movie.id);
            duration.textContent = `${movieDetails.runtime} min`;
            const watchlater=document.createElement('span');
            watchlater.innerHTML = '<span class="material-symbols-outlined">bookmark</span>';
            
              watchlater.addEventListener('click', (event) => {
                event.stopPropagation(); 
                addWatchlist(img.src, name.textContent);
                const msg=document.createElement('p');
                msg.textContent="Added to watchlist";
                msgs.appendChild(msg);
                msg.style.transform="translateX(0)";
                setInterval(() => {
                    msg.style.transform="translateX(200%)";
                }, 3000);
            });
            moviediv.appendChild(img);
            moviediv.appendChild(name);
            moviediv.appendChild(year);
            moviediv.appendChild(genre);
            moviediv.appendChild(duration);
            moviediv.appendChild(watchlater);

            watchlater.style.display="none";
            moviediv.addEventListener("mouseover", () => {
                watchlater.style.display="block";
            });
            moviediv.addEventListener("mouseout", () => {
                watchlater.style.display="none";
            });

            imgdiv.appendChild(moviediv);

            moviediv.addEventListener("click", () => {
                addHistory(img.src, name.textContent);
                window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/movie/${movie.id}`;
            });
        }

        slidegenre.textContent = getGenreNames(trendingMovies[imgindex].genre_ids);
        title.textContent = trendingMovies[imgindex].title;
        discription.textContent = trendingMovies[imgindex].overview;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getLatestMovies() {
    try {
        const response = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=b6a27c41bfadea6397dcd72c3877cac1");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        latestMovies = data.results;
        const imgdiv = document.querySelector('.latest .imgdiv');
        imgdiv.innerHTML = ''; 

        for (const movie of data.results) {
            const moviediv = document.createElement('div');
            moviediv.classList.add('movie');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
            img.alt = movie.title;

            const name = document.createElement('p');
            name.classList.add('name');
            name.textContent = movie.title;

            const year = document.createElement('p');
            year.classList.add('year');
            year.textContent = movie.release_date.slice(0, 4);

            const genre = document.createElement('p');
            genre.classList.add('genre');
            genre.textContent = getGenreNames(movie.genre_ids);

            const duration = document.createElement('p');
            duration.classList.add('duration');
            const movieDetails = await getMovieDetails(movie.id);
            duration.textContent = `${movieDetails.runtime} min`;
            const watchlater=document.createElement('span');
            watchlater.innerHTML = '<span class="material-symbols-outlined">bookmark</span>';
            
            const msgs=document.querySelector('.added');
            watchlater.addEventListener('click', (event) => {
              msg=document.createElement('p');
              msg.textContent="Added to watchlist";
              event.stopPropagation(); 
              addWatchlist(img.src, name.textContent);
              msg.style.transform="translateX(0)";
              msgs.appendChild(msg);

              setTimeout(() => {
                  msg.style.transform="translateX(200%)";
              }, 3000);
          });
            moviediv.appendChild(img);
            moviediv.appendChild(name);
            moviediv.appendChild(year);
            moviediv.appendChild(genre);
            moviediv.appendChild(duration);
            moviediv.appendChild(watchlater);

            watchlater.style.display="none";
            moviediv.addEventListener("mouseover", () => {
                watchlater.style.display="block";
            });
            moviediv.addEventListener("mouseout", () => {
                watchlater.style.display="none";
            });

            imgdiv.appendChild(moviediv);
            moviediv.appendChild(img);
            moviediv.appendChild(name);
            moviediv.appendChild(year);
            moviediv.appendChild(genre);
            moviediv.appendChild(duration);

            imgdiv.appendChild(moviediv);

            moviediv.addEventListener("click", () => {
                addHistory(img.src, name.textContent);
                window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/movie/${movie.id}`;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getTrendingTvShows() {
    try {
        const response = await fetch("https://api.themoviedb.org/3/trending/tv/week?api_key=b6a27c41bfadea6397dcd72c3877cac1");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        tvshows = data.results;
        const imgdiv = document.querySelector('.tv .imgdiv');
        imgdiv.innerHTML = ''; 

        for (const tvshow of data.results) {
            const tvdiv = document.createElement('div');
            tvdiv.classList.add('movie');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w1280${tvshow.backdrop_path}`;
            img.alt = tvshow.name;

            const name = document.createElement('p');
            name.classList.add('name');
            name.textContent = tvshow.name;

            const year = document.createElement('p');
            year.classList.add('year');
            year.textContent = tvshow.first_air_date.slice(0, 4);

            const genre = document.createElement('p');
            genre.classList.add('genre');
            genre.textContent = getGenreNames(tvshow.genre_ids, true);

            const tvDetails = await getTvShowDetails(tvshow.id);
            const season = document.createElement('p');
            season.classList.add('season');
            season.textContent = `season ${tvDetails.number_of_seasons}`;

            const watchlater=document.createElement('span');
            watchlater.innerHTML = '<span class="material-symbols-outlined">bookmark</span>';
            const msgs=document.querySelector('.added');
            watchlater.addEventListener('click', (event) => {
              msg=document.createElement('p');
              msg.textContent="Added to watchlist";
              event.stopPropagation(); 
              addWatchlist(img.src, name.textContent);
              msg.style.transform="translateX(0)";
              msgs.appendChild(msg);

              setTimeout(() => {
                  msg.style.transform="translateX(200%)";
              }, 3000);
          });

             watchlater.style.display="none";
            tvdiv.addEventListener("mouseover", () => {
                watchlater.style.display="block";
            });
            tvdiv.addEventListener("mouseout", () => {
                watchlater.style.display="none";
            });


            tvdiv.appendChild(img);
            tvdiv.appendChild(name);
            tvdiv.appendChild(year);
            tvdiv.appendChild(genre);
            tvdiv.appendChild(season);
            tvdiv.appendChild(watchlater);

            imgdiv.appendChild(tvdiv);

            tvdiv.addEventListener("click", () => {
                addHistory(img.src, name.textContent);
                window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/tv/${tvshow.id}/${1}`;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showslide(index) {
    let currentItem;
    let isTvShow = false;
    const type = document.querySelector('.type');
    if (index < trendingMovies.length) {
        currentItem = trendingMovies[index];
    } else if (index - trendingMovies.length < tvshows.length) {
        currentItem = tvshows[index - trendingMovies.length];
        isTvShow = true;
    }

    if (currentItem) {
        slidegenre.textContent = currentItem.genre_ids ? getGenreNames(currentItem.genre_ids, isTvShow) : '';
        title.textContent = currentItem.title || currentItem.name;
        discription.textContent = currentItem.overview;
        type.textContent = isTvShow ? 'TV Show' : 'Movie';

        sliderimgs.forEach((img, i) => {
            if (i === index) {
                img.style.display = 'block';
                img.src = `https://image.tmdb.org/t/p/w1280${currentItem.backdrop_path}`;
            } else {
                img.style.display = 'none';
            }
        });

        if (sliderimgs.length === 0) {
            const img = document.createElement('img');
            img.classList.add('img');
            img.src = `https://image.tmdb.org/t/p/w1280${currentItem.backdrop_path}`;
            document.querySelector('.imgslider').appendChild(img);
        }
    } else {
        console.error('Invalid index or currentItem is undefined');
    }
}

function nextslide() {
    indexslide = Math.floor(Math.random() * (trendingMovies.length + tvshows.length));
    showslide(indexslide);
}

document.addEventListener('DOMContentLoaded', () => {
    indexslide = Math.floor(Math.random() * (trendingMovies.length + tvshows.length));
    showslide(indexslide);
});

async function getsuggestions(moviename) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=b6a27c41bfadea6397dcd72c3877cac1&query=${moviename}`);
    const data = await response.json();
    return data;
}

function displaySuggestions(suggestions) {
    ul.innerHTML = ''; 
    if (suggestions.results.length > 0) {
        suggestions.results.forEach((suggestion) => {
            if(suggestion.media_type === 'person' || suggestion.media_type === 'company' || !suggestion.backdrop_path) {
                return;
            }
            const pdiv = document.createElement('div');
            const li = document.createElement('li');
            const img = document.createElement('img');
            const year = document.createElement('p');
            const genre = document.createElement('p');
            const type = document.createElement('p');
            li.textContent = suggestion.title || suggestion.name;
            img.src = `https://image.tmdb.org/t/p/w1280${suggestion.backdrop_path}`;
            year.textContent = suggestion.release_date ? suggestion.release_date.slice(0, 4) : '';
            genre.textContent = getGenreNames(suggestion.genre_ids || [], suggestion.media_type === 'tv');
            type.textContent = suggestion.media_type ? suggestion.media_type : '';
            ul.appendChild(li);
            li.prepend(img);
            pdiv.appendChild(year);
            pdiv.appendChild(genre);
            pdiv.appendChild(type);
            li.appendChild(pdiv);

            li.addEventListener("click", () => {
                addHistory(img.src, li.textContent);
                window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/${suggestion.media_type}/${suggestion.id}`;
            });
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No results found';
        li.style.color = 'red';
        li.style.background = 'none';
        ul.appendChild(li);
    }
}

input.addEventListener('input', async () => {
    const suggestions = await getsuggestions(input.value);
    displaySuggestions(suggestions);
    if (input.value === '') {
        ul.style.display = 'none';
    } else {
        ul.style.display = 'block';
    }
});

window.addEventListener('click', (e) => {
    if (e.target !== input && !ul.contains(e.target)) {
        ul.style.display = 'none';
    }
});

search.addEventListener('click', async () => {
    const data = await searchMovie(input.value);
    if (data.results && data.results.length > 0) {
        addHistory(data.results[0].backdrop_path, data.results[0].title || data.results[0].name);
        window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/movie/${data.results[0].id}`;
    } else {
        console.error('No results found');
    }
});

async function searchMovie(searchText) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=b6a27c41bfadea6397dcd72c3877cac1&query=${searchText}`);
    const data = await response.json();
    console.log(data);
    return data;
}

history.addEventListener("click", () => {
    if (historydiv.style.transform === 'translateX(0px)') {
        historydiv.style.transform = 'translateX(-200%)';
    } else {
        historydiv.style.transform = 'translateX(0)';
    }
});
window.addEventListener('click', (e) => {
    if (e.target !== history && !historydiv.contains(e.target)) {
        historydiv.style.transform = 'translateX(-200%)';
    }
}); 
function addHistory(image, name) {
    historys.unshift({ image, name });
    localStorage.setItem('historys', JSON.stringify(historys));
    setHistory();
}

function setHistory() {
    historydiv.innerHTML = ''; 
    const ul = document.createElement('ul');
    if (historys.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No history';
        li.style.color = 'red';
        li.style.listStyle='none';
        li.style.margin='5px';
        li.style.background = 'none';
        ul.appendChild(li);
    }
    historys.forEach((item, index) => {
        const li = document.createElement('li'); 
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        const name = document.createElement('p');
        name.textContent = item.name;
        const span = document.createElement('span');
        span.innerHTML = '&times;';
        span.classList.add('delete-icon'); 
        span.addEventListener('click', (event) => {
            event.stopPropagation(); 
            event.preventDefault(); 
            deleteHistory(index);
        });
        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(span); 
        ul.appendChild(li); 
        li.addEventListener("click", () => {
            window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/movie/${item.id}`;
        });
    });
    historydiv.appendChild(ul);
}

function deleteHistory(index) {
    historys.splice(index, 1);
    localStorage.setItem('historys', JSON.stringify(historys));
    setHistory();
}

history.addEventListener("click", () => {
    if (historydiv.classList.contains('visible')) {
        historydiv.classList.remove('visible');
    } else {
        historydiv.classList.add('visible');
    }
});

function addWatchlist(image, name) {
    watchlists.unshift({ image, name });
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
    setWatchList();
}
const watchlistdiv= document.querySelector('.watchlistdiv');
function deleteWatchList(index) {
    watchlists.splice(index, 1);
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
    setWatchList();
}

function setWatchList() {
    watchlistdiv.innerHTML = '';
    if (watchlists.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No watchlist';
        li.style.color = 'red';
        li.style.listStyle='none';
        li.style.margin='5px';
        li.style.background = 'none';
        watchlistdiv.appendChild(li);
    }
    const ul = document.createElement('ul');
    const uniqueWatchlists = watchlists.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.name === item.name
        ))
    );
    uniqueWatchlists.forEach((item, index) => {
        const li = document.createElement('li'); 
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        const name = document.createElement('p');
        name.textContent = item.name;
        const span = document.createElement('span');
        span.innerHTML = '&times;';
        span.classList.add('delete-icon'); 
        span.addEventListener('click', (event) => {
            event.stopPropagation(); 
            event.preventDefault(); 
            deleteWatchList(index);
        });
        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(span); 
        ul.appendChild(li);
        li.addEventListener("click", () => {
            window.location.href = `video.html?src=https://vidsrc.cc/v3/embed/movie/${item.id}`;
        });
    });
    watchlistdiv.prepend(ul);
}

const wishlist=document.querySelector('.wishlist');
wishlist.addEventListener("click", () => {
    if (watchlistdiv.style.transform === 'translateX(0px)') {
        watchlistdiv.style.transform = 'translateX(-200%)';
    } else {
        watchlistdiv.style.transform = 'translateX(0)';
    }
});
window.addEventListener('click', (e) => {
    if (e.target !== wishlist && !watchlistdiv.contains(e.target)) {
        watchlistdiv.style.transform = 'translateX(-200%)';
    }
});
const aside=document.querySelector('aside');
const menudtn=document.querySelector('.menu-icon');
const closes=document.querySelector('.close');
closes.style.display="none";
if (menudtn) {
    function handleResize() {
        if (window.innerWidth > 1200) {
            closes.style.display = "none";
            aside.style.transform = 'translateX(0)';
        } else {
            aside.style.transform = 'translateX(-200%)';
            closes.style.display = "block";
            closes.addEventListener("click", () => {
                aside.style.transform = 'translateX(-200%)';
            });
            menudtn.addEventListener("click", () => {
                aside.style.transform = 'translateX(0)';
            });
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); 
}


async function init() {
    await getGenreList();
    await getTrendingMovies();
    await getLatestMovies();
    await getTrendingTvShows();
    showslide(indexslide);
    setInterval(nextslide, 9000);
    setHistory();
    setWatchList();
}

init();
