import axios from 'axios';

const API_KEY = '47026899-90f4472111ba4dcf335a9f60a';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(request, page = 1) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: request,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 15,
  });
  const url = `${BASE_URL}?${searchParams}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topLeft',
    });
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}