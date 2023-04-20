export { fetchRequests, loadMore };
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

const [mainContent] = document.getElementsByClassName('gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let gallery;
let markup = '';
let page = 1;
function fetchRequests(e) {
  if (e.target.value.trim()) {
    let feltchRequest = axios
      .get(
        `https://pixabay.com/api/?key=35462061-8a52d4784631467a148110ba5&q=${e.target.value.trim()}&image_type=photo&pretty=true&page=${page}`
      )
      .then(response => {
        if (response.data.hits.length === 0) {
          Notify.failure(
            'Sorry there are no images matching your search quaery. Please try again'
          );
          return 0;
        }
        return response.data.hits;
      });
    makeMarkup(feltchRequest);
  } else {
    countryCard.innerHTML = '';
    countryList.innerHTML = '';
  }
}
function makeMarkup(requestsArray) {
  requestsArray.then(requests => {
    if (requests === 0) {
      return;
    }
    markup = requests.reduce((acc, request) => {
      acc += makeOneCard(request);
      return acc;
    }, '');

    mainContent.innerHTML = markup;
    loadMoreBtn.classList.remove('disabled');

    createGallery();
  });
}
function createGallery() {
  gallery = new SimpleLightbox('.gallery a');
  mainContent.addEventListener('click', onImageClick);
}
function onImageClick(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
    return;
  }
  gallery.on('closed.simplelightbox', function () {
    gallery.refresh();
  });
}
function makeOneCard(oneImg) {
  const {
    largeImageURL: img,
    webformatURL,
    comments,
    downloads,
    likes,
    views,
    tags,
  } = oneImg;
  let markup = `<li class="gallery__item"><a href=${img} class="gallery__link"> 
  <img class="gallery__image" src=${webformatURL} alt=${tags} />
<ul>
<li>Likes: <span class="number-of">${likes}</span> </li>
<li>Views: <span class="number-of">${views}</span> </li>
<li>Comments: <span class="number-of">${comments}</span> </li>
<li>Downloads: <span class="number-of">${downloads}</span> </li>

</ul>
  </a></li>`;
  // console.log(markup);

  return markup;
}
function loadMore() {
  const inputEl = document.getElementById('search-box');

  const value = inputEl.value.trim();
  page += 1;
  let feltchRequest = axios
    .get(
      `https://pixabay.com/api/?key=35462061-8a52d4784631467a148110ba5&q=${value}&image_type=photo&pretty=true&page=${page}`
    )
    .then(response => {
      return response.data.hits;
    });
  addNewElement(feltchRequest);
}

function addNewElement(requestsArray) {
  requestsArray.then(requests => {
    let newMarkup = requests.reduce((acc, request) => {
      acc += makeOneCard(request);
      return acc;
    }, '');
    markup += newMarkup;
    mainContent.innerHTML = markup;
    gallery.refresh();
  });
}
