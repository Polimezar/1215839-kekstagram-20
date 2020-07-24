'use strict';

(function () {
  var filtersContainer = document.querySelector('.img-filters');
  var defaultOrderButton = filtersContainer.querySelector('#filter-default');
  var randomOrderButton = filtersContainer.querySelector('#filter-random');
  var discussedOrderButton = filtersContainer.querySelector('#filter-discussed');
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
  var picturesContainer = document.querySelector('.pictures');
  var main = document.querySelector('main');

  // Создание DOM элементов
  var createPostElement = function (post) {
    var clonedPost = pictureTemplate.cloneNode(true);
    clonedPost.querySelector('.picture__img').src = post.url;
    clonedPost.querySelector('.picture__likes').textContent = post.likes;
    clonedPost.querySelector('.picture__comments').textContent = post.comments.length;
    clonedPost.addEventListener('click', function () {
      window.post.showBigPicture(post);
    });
    return clonedPost;
  };

  // Отрисовка DOM элемента на странице
  var createPostElements = function (posts) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < posts.length; i++) {
      fragment.appendChild(createPostElement(posts[i]));
    }
    picturesContainer.appendChild(fragment);
  };

  var removePhotos = function () {
    var pictures = document.querySelectorAll('.picture');
    pictures.forEach(function (el) {
      picturesContainer.removeChild(el);
    });
  };

  var getDefaultOrder = function (pictures) {
    return pictures;
  };

  var getRandomOrder = function (pictures) {
    var randomUniqueArray = window.utils.getUniqueArray(0, pictures.length);
    var randomPictures = [];
    randomUniqueArray.forEach(function (item) {
      return randomPictures.push(pictures[item]);
    });
    return randomPictures;
  };

  var getDiscussedOrder = function (pictures) {
    var sortCommentPictures = pictures;
    sortCommentPictures.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    return sortCommentPictures;
  };

  var clickFilterButton = function (photos) {
    var sortPictures = [];

    var onButtonDefaultClick = window.debounce.debounce(function (evt) {
      changeFilter(getDefaultOrder, evt);
    });

    var onButtonRandomClick = window.debounce.debounce(function (evt) {
      changeFilter(getRandomOrder, evt);
    });

    var onButtonDiscussionClick = window.debounce.debounce(function (evt) {
      changeFilter(getDiscussedOrder, evt);
    });

    var changeFilter = function (callback, evt) {
      evt.preventDefault();
      var target = evt.target;
      if (target.type === 'button') {
        var currentFilters = filtersContainer.querySelector('.img-filters__button--active');
        currentFilters.classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        removePhotos();
        sortPictures = callback(photos);
        createPostElements(sortPictures, picturesContainer);
      }
    };

    defaultOrderButton.addEventListener('click', onButtonDefaultClick);
    randomOrderButton.addEventListener('click', onButtonRandomClick);
    discussedOrderButton.addEventListener('click', onButtonDiscussionClick);
  };

  var onLoadSuccess = function (pictures) {
    createPostElements(pictures, picturesContainer);
    filtersContainer.classList.remove('img-filters--inactive');
    clickFilterButton(pictures);
  };

  var onLoadError = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.classList.add('error-block');
    errorBlock.textContent = errorMessage;
    main.insertAdjacentElement('afterbegin', errorBlock);
  };

  window.backend.download(onLoadSuccess, onLoadError);
})();
