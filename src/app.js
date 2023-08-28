import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = '39118753-abd33f469ba20429c9813a50a';
let currentPage = 1;
let currentQuery = '';

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  currentQuery = e.target.searchQuery.value.trim();

  if (currentQuery === '') {
    return;
  }

  try {
    const response = await searchImages(currentQuery, currentPage);
    displayImages(response.data.hits);
    checkAndDisplayLoadMore(response.data.totalHits);
  } catch (error) {
    showErrorNotification('An error occurred while fetching images.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  try {
    currentPage++;
    const response = await searchImages(currentQuery, currentPage);
    displayImages(response.data.hits);
    checkAndDisplayLoadMore(response.data.totalHits);
  } catch (error) {
    showErrorNotification('An error occurred while loading more images.');
  }
});

async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

function displayImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    
    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';
    
    const info = document.createElement('div');
    info.classList.add('info');
    
    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;
    
    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;
    
    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;
    
    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;
    
    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);
    
    card.appendChild(img);
    card.appendChild(info);
    
    gallery.appendChild(card);
  });
}

function checkAndDisplayLoadMore(totalHits) {
  if (currentPage * 40 < totalHits) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    if (totalHits === 0) {
      showErrorNotification("Sorry, there are no images matching your search query. Please try again.");
    } else {
      showInfoNotification("We're sorry, but you've reached the end of search results.");
    }
  }
}

function showErrorNotification(message) {
  Notiflix.Notify.Failure(message);
}

function showInfoNotification(message) {
  Notiflix.Notify.Info(message);
}