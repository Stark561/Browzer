import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { smoothScroll } from './js/smoothScroll.js';
import { renderMarkup } from './js/renderMarkup.js';

const form = document.querySelector('.header');
const loader = document.querySelector('#loader');
const input = form.elements.searchQuery;
const gallery = document.querySelector('.gallery');
form.addEventListener('submit', onBtnSubmit);
let page = 1;
let perPage = 40;
let totalImages = 0;
let observer;
let isFormSubmitted = false;
let totalPages = 0;

const options = {
  rootMargin: '0px',
  threshold: 1.0,
};

let lightbox = new simpleLightbox('.gallery a');

async function loadContent() {
  const inputValue = input.value;
  const API_KEY = '36186802-862f6fad69a85448277218aac';
  const BASE_URL = `https://pixabay.com/api`;
  const END_POINT = `/?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;
  const url = BASE_URL + END_POINT;
  try {
    const response = await axios.get(url);
    totalImages = response.data.totalHits;
    totalPages = Math.ceil(totalImages / perPage);
    if (totalImages === 0) {
      return Notiflix.Notify.failure(
        'К сожалению, нет изображений, соответствующих вашему поисковому запросу. Пожалуйста, попробуйте еще раз.'
      );
    }
    console.log(totalPages);
    console.log(page);

    if (!isFormSubmitted) {
      Notiflix.Notify.success(`Ура! Мы нашли ${totalImages} изображений.`);
      isFormSubmitted = true;
    }
    if (totalPages === page) {
      observer.unobserve(loader)
      Notiflix.Notify.failure(
        'Сожалеем, но вы достигли конца результатов поиска.'
      );
    }

    const images = response.data.hits.map(image => ({
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
      likes: image.likes,
      views: image.views,
      comments: image.comments,
      downloads: image.downloads,
    }));
    console.log(images);

    gallery.insertAdjacentHTML('beforeend', renderMarkup(images));
    lightbox.refresh();
    const firstChild = gallery.firstElementChild;
    if (firstChild) {
      setTimeout(smoothScroll, 400);
    }
    page++;
  } catch (err) {
    Notiflix.Notify.failure(
      'Сожалеем, но вы достигли конца результатов поиска.'
    );
    console.log(err);
  }
}

function onBtnSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  isFormSubmitted = false;
  page = 1;

  if (observer) {
    observer.unobserve(loader);
  }
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadContent();
    }
  }, options);
  observer.observe(loader);
}
