export { fetchRequests, checkPosition };
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
const _ = require('lodash');
const DEBOUNCE_DELAY = 800;
const throttledLoadMore = _.throttle(loadMore, DEBOUNCE_DELAY);

const [mainContent] = document.getElementsByClassName('gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

const radioBtn = document.getElementsByClassName('radio-buttons');
const radioPhoto = document.getElementById('js-photo');
const radioVideo = document.getElementById('js-video');

let baseUrl =
  'https://pixabay.com/api/?key=35462061-8a52d4784631467a148110ba5&q=';
let typeOfResponse = 1;

radioPhoto.addEventListener('click', () => {
  baseUrl =
    'https://pixabay.com/api/?key=35462061-8a52d4784631467a148110ba5&q=';
  typeOfResponse = 1;
});
radioVideo.addEventListener('click', () => {
  baseUrl =
    'https://pixabay.com/api/videos/?key=35462061-8a52d4784631467a148110ba5&q=';
  typeOfResponse = 2;
});
// console.log(baseUrl);

// const BASE_URL =
//   'https://pixabay.com/api/?key=35462061-8a52d4784631467a148110ba5&q=';
// const BASE_URL =
//   'https://pixabay.com/api/videos/?key=35462061-8a52d4784631467a148110ba5&q=';

let gallery;
let markup = '';
let page = 1;
let totalHits = 0;
let finalTotalHits = 0;

async function fetchRequests(e) {
  totalHits = 0;
  page = 1;
  if (e.target.value.trim()) {
    console.log(baseUrl);
    console.log(typeOfResponse);
    let feltchRequest = {};
    if (typeOfResponse === 1) {
      feltchRequest = await axios.get(
        `${baseUrl}${e.target.value.trim()}&image_type=photo&pretty=true&orientation=horizontal&safesearch=true&webformatURL=180&per_page=40&&page=${page}`
      );
    } else {
      feltchRequest = await axios.get(
        `${baseUrl}${e.target.value.trim()}&safesearch=true&per_page=20&&page=${page}`
      );
    }

    finalTotalHits = feltchRequest.data.totalHits;
    if (feltchRequest.data.hits.length === 0) {
      if (typeOfResponse === 1) {
        Notify.failure(
          `Sorry there are no images matching your search ${e.target.value.trim()}. Please try again`
        );
        mainContent.innerHTML = '';
        loadMoreBtn.classList.add('disabled');
        return 0;
      } else {
        Notify.failure(
          `Sorry there are no videos matching your search ${e.target.value.trim()}. Please try again`
        );
        mainContent.innerHTML = '';
        loadMoreBtn.classList.add('disabled');
        return 0;
      }
    }
    if (typeOfResponse === 1) {
      Notify.success(`Hooray! we found ${feltchRequest.data.totalHits} images`);
      makeMarkupForImage(feltchRequest.data.hits);
    } else {
      Notify.success(`Hooray! we found ${feltchRequest.data.totalHits} videos`);
      makeMarkupForVideos(feltchRequest.data.hits);
    }
  } else {
    mainContent.innerHTML = '';
    loadMoreBtn.classList.add('disabled');
  }
}

function makeOneImageCard(oneImg) {
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
  return markup;
}

function makeMarkupForImage(requestsArray) {
  mainContent.style.alignItems = '';

  page = 1;
  totalHits += requestsArray.length;
  if (requestsArray === 0) {
    return;
  }
  markup = requestsArray.reduce((acc, request) => {
    acc += makeOneImageCard(request);
    return acc;
  }, '');
  mainContent.innerHTML = markup;
  if (totalHits > finalTotalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  if (totalHits < finalTotalHits) {
    loadMoreBtn.classList.remove('disabled');
  }
  gallery = new SimpleLightbox('.gallery a');
}

function makeMarkupForVideos(requestsArray) {
  mainContent.style.alignItems = 'flex-start';
  console.log(mainContent);
  page = 1;
  totalHits += requestsArray.length;
  if (requestsArray === 0) {
    return;
  }
  markup = requestsArray.reduce((acc, request) => {
    acc += makeOneVideoCard(request);
    return acc;
  }, '');
  mainContent.innerHTML = markup;
  if (totalHits > finalTotalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  if (totalHits < finalTotalHits) {
    loadMoreBtn.classList.remove('disabled');
  }
}
function makeOneVideoCard(oneVideo) {
  const {
    videos: video,
    picture_id: img,
    comments,
    downloads,
    likes,
    views,
  } = oneVideo;
  let markup = `<li class="gallery__item">
  <video
  src=${video.tiny.url}
  poster=https://i.vimeocdn.com/video/${img}_640x360.jpg
  controls
    preload="metadata"
></video>
<ul>
<li>Likes: <span class="number-of">${likes}</span> </li>
<li>Views: <span class="number-of">${views}</span> </li>
<li>Comments: <span class="number-of">${comments}</span> </li>
<li>Downloads: <span class="number-of">${downloads}</span> </li>

</ul>
  </a></li>`;
  console.log(markup);
  return markup;
}

async function loadMore() {
  // console.log(`totalHits:${totalHits}`);
  // console.log(`finalTotalHits:${finalTotalHits}`);
  if (totalHits >= finalTotalHits) {
    return;
  }
  if (finalTotalHits < totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    window.removeEventListener('scroll', _.throttle(checkPosition, 1000));

    loadMoreBtn.classList.add('disabled');
    return;
  }
  const inputEl = document.getElementById('search-box');
  const imagesEl = document.getElementsByClassName('gallery__item');

  const value = inputEl.value.trim();
  page += 1;

  let feltchRequest = await axios.get(
    `${baseUrl}${value}&image_type=photo&pretty=true&orientation=horizontal&safesearch=true&webformatURL=180&per_page=40&&page=${page}`
  );
  addNewElements(feltchRequest.data.hits);
  console.log(imagesEl.length);
}

function addNewElements(requestsArray) {
  if (typeOfResponse === 2) {
    loadMoreBtn.classList.add('disabled');
    Notify.failure('Далі не реалізовано, sorry...');

    return;
  }
  let newMarkup = requestsArray.reduce((acc, request) => {
    acc += makeOneImageCard(request);
    return acc;
  }, '');
  markup += newMarkup;
  mainContent.innerHTML = markup;
  totalHits += 40;
  if (finalTotalHits < totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.add('disabled');
  }
  const oneImg = document
    .querySelector('ul')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: oneImg.height * 2,
    behavior: 'smooth',
  });
  gallery.refresh();
}
function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  if (position >= threshold) {
    throttledLoadMore();
  }
}
