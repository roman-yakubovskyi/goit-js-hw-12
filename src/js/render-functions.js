const gallery = document.querySelector('.gallery');

export function createMarkup(arrImages) {
  const markup = arrImages
    .map(image => {
      return `<li class="gallery-item">
	  <a class="gallery-link" href="${image.largeImageURL}">
		<img 
			class="gallery-image" 
			src="${image.webformatURL}" 
			alt="${image.tags}" loading="lazy"
			/>
        <div class="gallery-info">
        <p class="gallery-likes"><span>Likes:</span> ${image.likes}</p>
        <p class="gallery-views"><span>Views:</span> ${image.views}</p>
        <p class="gallery-comments"><span>Comments:</span> ${image.comments}</p>
        <p class="gallery-downloads"><span>Downloads:</span> ${image.downloads}</p>
      </div>    
	  </a>
    </li>
    `;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
