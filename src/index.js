import { fetchRequests, loadMore } from './js/fetchRequest';

import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
var _ = require('lodash');

const inputEl = document.getElementById('search-box');
const loadMoreBtn = document.querySelector('.load-more-btn');

const DEBOUNCE_DELAY = 800;

inputEl.addEventListener('input', _.debounce(fetchRequests, DEBOUNCE_DELAY));
loadMoreBtn.addEventListener('click', loadMore);
