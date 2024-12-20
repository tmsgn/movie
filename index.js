const imgs = document.querySelectorAll(".img");
const title = document.querySelector(".title");
let indexslide = 0;
let imgindex = 0;

async function getTrendingMovies() {
    try {
        const response = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=b6a27c41bfadea6397dcd72c3877cac1");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        trendingMovies = data.results;
        imgs.forEach((img, index) => {
            if (index < trendingMovies.length) {
                img.src = `https://image.tmdb.org/t/p/w1280${trendingMovies[index].backdrop_path}`;
            }
        });
        title.textContent = trendingMovies[imgindex].title;
    } catch (error) {
        console.error('Error:', error);
    }
}

function showslide(index) {
    imgs.forEach((img) => {
        img.style.display = "none";
    });
    imgs[index].style.display = "block";
}

function nextslide() {
    indexslide++;
    imgindex++;
    if (indexslide >= imgs.length) {
        indexslide = 0;
    }
    if (imgindex >= trendingMovies.length) {
        imgindex = 0;
    }
    showslide(indexslide);
    title.textContent = trendingMovies[imgindex].title;
}

getTrendingMovies();
showslide(indexslide);
setInterval(nextslide, 7000);