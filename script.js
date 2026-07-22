const ACCESS_KEY = "phvo6xBUJipsH14aa6oC0DDJc_iq1JGSuExX-w5EVDg";

const body = document.querySelector(".body");
const wallpaperGrid = document.getElementById("wallpaperGrid");

const userSearch = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");

const categoryBtn = document.querySelector(".category-btn");
const categoryMenu = document.querySelector(".category-menu");
const categoryButtons = document.querySelectorAll(".category-menu button");

const favBtn = document.querySelector(".fav-btn");

let currentPage = 1;
let currentQuery = null;
let currentCategory = null;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function showWallpaperDetails(photo) {
  body.innerHTML = `
        <div class="wallpaper-details">

            <img
                src="${photo.urls.regular}"
                alt="${photo.alt_description || "Wallpaper"}"
                class="details-image"
            >

            <div class="details-content">

                <h1 style="color: #94a3b8;">
                    ${photo.alt_description || "Wallpaper"}
                </h1>

                <p>
                    By ${photo.user.name}
                </p>

                <button id="downloadBtn">
                    Download
                </button>

                <button id="favoriteBtn">
                    Add to Favorites
                </button>

            </div>

        </div>
    `;

  const downloadBtn = document.getElementById("downloadBtn");
  const favoriteBtn = document.getElementById("favoriteBtn");

  downloadBtn.addEventListener("click", () => {
    window.open(photo.urls.full, "_blank");
  });

  const exists = favorites.some((item) => item.id === photo.id);

  if (exists) {
    favoriteBtn.textContent = "Remove from Favorites";
  } else {
    favoriteBtn.textContent = "Add to Favorites";
  }

  favoriteBtn.addEventListener("click", () => {
    const exists = favorites.some((item) => item.id === photo.id);

    if (exists) {
      favorites = favorites.filter((item) => item.id !== photo.id);

      favoriteBtn.textContent = "Add to Favorites";
    } else {
      favorites.push(photo);

      favoriteBtn.textContent = "Remove from Favorites";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });
}

async function searchWallpapers(query, page = 1) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20&client_id=${ACCESS_KEY}`,
    );

    const data = await response.json();

    const searchLoadMoreBtn = document.getElementById("load-wallpaper-btn");

if (searchLoadMoreBtn) {
  if (data.results.length < 20) {
    searchLoadMoreBtn.style.display = "none";
  } else {
    searchLoadMoreBtn.style.display = "block";
  }
}

    if (page === 1) {
      body.innerHTML = `
      <h1 class="search-title">
          Search Results for "${query}"
      </h1>

      <div id="searchGrid" class="wallpaper-grid"></div>

      <div class="load-wallpaper-container">
          <button id="load-wallpaper-btn">Load More Wallpapers</button>
          <a href="#navbar" class="top">Back to top</a>
      </div>
  `;

      const searchLoadMoreBtn = document.getElementById("load-wallpaper-btn");

      searchLoadMoreBtn.addEventListener("click", () => {
        currentPage++;
        searchWallpapers(currentQuery, currentPage);
      });
    }

    const searchGrid = document.getElementById("searchGrid");

    data.results.forEach((photo) => {
      const card = document.createElement("div");

      card.classList.add("wallpaper-card");

      card.innerHTML = `
                <img
                    src="${photo.urls.regular}"
                    alt="${photo.alt_description || "Wallpaper"}"
                    loading="lazy"
                >

                
            `;

      card.addEventListener("click", () => {
        showWallpaperDetails(photo);
      });

      searchGrid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const query = userSearch.value.trim();

  if (!query) return;

  currentPage = 1;
  currentQuery = query;
  currentCategory = null;

  searchWallpapers(query, currentPage);
});

categoryBtn.addEventListener("click", () => {
  categoryMenu.classList.toggle("show");
});

document.addEventListener("click", (event) => {
  if (
    !categoryBtn.contains(event.target) &&
    !categoryMenu.contains(event.target)
  ) {
    categoryMenu.classList.remove("show");
  }
});

async function loadCategoryWallpapers(category, page = 1) {
  currentCategory = category;
  currentQuery = null;
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${category}&page=${page}&per_page=20&client_id=${ACCESS_KEY}`,
    );

    const data = await response.json();


    if (page === 1) {
      body.innerHTML = `
      <div class="popular-wallpaper-text">
          <p id="wallpaperTitle">
              ${category.charAt(0).toUpperCase() + category.slice(1)} Wallpapers
          </p>
      </div>

      <div id="wallpaperGrid"></div>

      <div class="load-wallpaper-container">
          <button id="load-wallpaper-btn">Load More Wallpapers</button>
          <a href="#navbar" class="top">Back to top</a>
      </div>
  `;
      const categoryLoadMoreBtn = document.getElementById("load-wallpaper-btn");

      categoryLoadMoreBtn.addEventListener("click", () => {
        currentPage++;
        loadCategoryWallpapers(currentCategory, currentPage);
      });
    }

    const categoryLoadMoreBtn = document.getElementById("load-wallpaper-btn");

    if (categoryLoadMoreBtn) {
      if (data.results.length < 20) {
        categoryLoadMoreBtn.style.display = "none";
      } else {
        categoryLoadMoreBtn.style.display = "block";
      }
    }

    const newGrid = document.getElementById("wallpaperGrid");

    data.results.forEach((photo) => {
      const card = document.createElement("div");

      card.classList.add("wallpaper-card");

      card.innerHTML = `
                <img
                    src="${photo.urls.regular}"
                    alt="${photo.alt_description || "Wallpaper"}"
                    loading="lazy"
                >
            `;

      card.addEventListener("click", () => {
        showWallpaperDetails(photo);
      });

      newGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading category wallpapers:", error);
  }
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentPage = 1;
    currentCategory = button.dataset.category;

    loadCategoryWallpapers(currentCategory, currentPage);

    categoryMenu.classList.remove("show");
  });
});

function showFavorites() {
  body.innerHTML = `
        <h1 class="search-title">
            Your Favorites
        </h1>

        <div id="favoritesGrid"></div>
    `;

  const favoritesGrid = document.getElementById("favoritesGrid");

  favorites.forEach((photo) => {
    const card = document.createElement("div");

    card.classList.add("wallpaper-card");

    card.innerHTML = `
            <img
                src="${photo.urls.regular}"
                alt="${photo.alt_description || "Wallpaper"}"
                loading="lazy"
            >
        `;

    card.addEventListener("click", () => {
      showWallpaperDetails(photo);
    });

    favoritesGrid.appendChild(card);
  });
}

favBtn.addEventListener("click", showFavorites);

const loadMoreWllpapersBtn = document.querySelector("#load-wallpaper-btn");

let loadPopularWallpapers = async function loadPopularWallpapers(page = 1) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}&per_page=20&client_id=${ACCESS_KEY}`,
    );

    const data = await response.json();

    if (data.length < 20) {
      loadMoreWllpapersBtn.style.display = "none";
    } else {
      loadMoreWllpapersBtn.style.display = "block";
    }

    data.forEach((photo) => {
      const card = document.createElement("div");

      card.classList.add("wallpaper-card");

      card.innerHTML = `
        <img
          src="${photo.urls.regular}"
          alt="${photo.alt_description || "Wallpaper"}"
          loading="lazy"
        >
      `;

      card.addEventListener("click", () => {
        showWallpaperDetails(photo);
      });

      wallpaperGrid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
};

wallpaperGrid.innerHTML = "";
loadPopularWallpapers(currentPage);

loadMoreWllpapersBtn.addEventListener("click", () => {
  currentPage++;
  loadPopularWallpapers(currentPage);
});


const aboutBtn = document.querySelector(".about-btn");

aboutBtn.addEventListener("click", () => {
  showAboutPage();
});

function showAboutPage() {
  body.innerHTML = `
    <section class="about-container">

      <h1>About WallP</h1>

      <p>
        WallP is a wallpaper discovery platform that helps users find
        high-quality wallpapers for desktops, laptops, tablets, and mobile devices.
      </p>

      <p>
        Browse wallpapers by category, search for specific themes,
        save favorites, and download wallpapers easily.
      </p>

      <h2>Features</h2>

      <ul>
        <li>High-quality wallpapers</li>
        <li>Search wallpapers</li>
        <li>Category browsing</li>
        <li>Favorites collection</li>
        <li>Download wallpapers</li>
      </ul>

      <h2>Powered By</h2>

      <p>
        Wallpapers are provided through the Unsplash API.
      </p>

      <h2>Our Mission</h2>

      <p>
        Helping users personalize their devices with beautiful wallpapers.
      </p>

    </section>
  `;
}
