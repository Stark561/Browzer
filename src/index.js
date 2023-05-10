import axios from "axios";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";

const form = document.querySelector('.search-form');
const input = form.elements.searchQuery;
const btn = form.elements.submitBtn;
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#loader');
const scrollUp = document.querySelector('.scroll-up');
form.addEventListener('submit', onBtnSubmit);
let page = 1;
let totalImages = '';
let observer;
let isFormSubmitted = false;