import axios from "axios";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";

const form = document.querySelector('.search-form');
const input = form.elements.searchQuery;
const btn = form.elements.submitBtn;
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#loader');
const btnScrollUp = document.querySelector('.scroll-up');
form.addEventListener('submit', onBtnSubmit);
let page = 1;
let totalImages = '';
let observer;
let isFormSubmitted = false;

const options = {
    rootMargin: '0px',
    threshold: 1.0
  };

  let lightbox = new simpleLightbox('.gallery a');

function onBtnSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  isFormSubmitted = false;
  page = 1;
    
  if (observer) {
    observer.unobserve(loader);
  }
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadContent();
      page++;
    }
  }, options);

  observer.observe(loader);
}
async function loadContent() {
 
  const inputValue = input.value;
  const API_KEY = '36186802-862f6fad69a85448277218aac';
  const BASE_URL = `https://pixabay.com/api`;
  const END_POINT = `/?key=${API_KEY}&q=${inputValue}=&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  const url = BASE_URL + END_POINT;
 try {
    const response = await axios.get(url);
    totalImages = response.data.totalHits;
    if (totalImages === 0) {
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } 
    if (!isFormSubmitted) {
      Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
      isFormSubmitted = true;
    }

    const images = response.data.hits.map(image => ({
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
      likes: image.likes,
      views: image.views,
      comments: image.comments,
      downloads: image.downloads
    }))

    gallery.insertAdjacentHTML('beforeend', renderMarkup(images));
    lightbox.refresh();
    const firstChild = gallery.firstElementChild;

    if (firstChild) { 
      setTimeout(smoothScroll, 400);
    }
  } catch (err) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

 function renderMarkup(data) {
 return data.map(({webformatURL,largeImageURL,tags, likes, views, comments, downloads}) => `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div></a>`
 ).join('')
};

btnScrollUp.addEventListener('click', onScrollUp);

function onScrollUp(e) {
  window.scrollTo({
    top: 0,
    behavior:'smooth'
  })
}
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}