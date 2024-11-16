import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './js/render-functions';
import { fetchImages } from './js/pixabay-api';

let currentRequest = '';
let currentPage = 1;
let totalHits = 0;
let lightbox;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const loader = document.querySelector('.loader');
const loaderAdd = document.querySelector('.loader-add');
const loadButton = document.querySelector('.button-load');

form.addEventListener('submit', handleSubmit);
loadButton.addEventListener('click', loadImages);

function scrollSmoothPage() {
  const galleryItem = gallery.querySelector('.gallery-item');
  if (!galleryItem) return;
  const cardHeight = galleryItem.getBoundingClientRect().height;
  window.scrollBy({
    left: 0,
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  currentRequest = input.value.trim();
  currentPage = 1;
  if (!currentRequest) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query...',
      position: 'topLeft',
    });
    return;
  }
  loader.style.display = 'block';
  loadButton.style.display = 'none';
  try {
    const response = await fetchImages(currentRequest, currentPage);
    totalHits = response.totalHits;
    loader.style.display = 'none';
    if (response.hits.length === 0) {
      gallery.innerHTML = '';
      iziToast.info({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topLeft',
        timeout: 3000,
      });
      form.reset();
      return;
    }
    gallery.innerHTML = '';
    createMarkup(response.hits);
    lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionDelay: 300,
    });
    const allPages = Math.ceil(totalHits / 15);
    if (currentPage >= allPages) {
      loadButton.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topLeft',
        timeout: 3000,
      });
    } else {
      loadButton.style.display = 'block';
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topLeft',
    });
    console.error('Error fetching images:', error);
  }
}

async function loadImages() {
  currentPage += 1;
  loaderAdd.style.display = 'block';
  loadButton.style.display = 'none';
  try {
    const response = await fetchImages(currentRequest, currentPage);
    loaderAdd.style.display = 'none';
    if (response.hits.length === 0) {
      loadButton.style.display = 'none';
      iziToast.info({
        title: 'No More Results',
        message: 'No more images available.',
        position: 'topLeft',
        timeout: 3000,
      });
      return;
    }
    createMarkup(response.hits);
    scrollSmoothPage();
    const allPages = Math.ceil(totalHits / 15);
    if (currentPage >= allPages) {
      loadButton.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topLeft',
        timeout: 3000,
      });
    } else {
      loadButton.style.display = 'block';
    }
    if (lightbox) {
      lightbox.refresh();
    }
  } catch (error) {
    loader.style.display = 'none';
    loadButton.style.display = 'block';
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch more images. Please try again later.',
      position: 'topLeft',
    });
    console.error('Error fetching more images:', error);
  }
}
