import { fetchRequests, loadMore } from './js/fetchRequest';

import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
var _ = require('lodash');

const inputEl = document.getElementById('search-box');
const loadMoreBtn = document.querySelector('.load-more-btn');

const DEBOUNCE_DELAY = 800;
const throttledLoadMore = _.throttle(loadMore, 5000);

inputEl.addEventListener('input', _.debounce(fetchRequests, DEBOUNCE_DELAY));
// loadMoreBtn.addEventListener('click', loadMore);
window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    throttledLoadMore();
  }
});
