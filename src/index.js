import { fetchRequests, checkPosition } from './js/fetchRequest';
import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const _ = require('lodash');
const inputEl = document.getElementById('search-box');
const DEBOUNCE_DELAY = 800;

inputEl.addEventListener('input', _.debounce(fetchRequests, DEBOUNCE_DELAY));
window.addEventListener('scroll', _.throttle(checkPosition, DEBOUNCE_DELAY));

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight,
//   behavior: 'smooth',
// });
