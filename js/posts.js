'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
  var picturesContainer = document.querySelector('.pictures');
  var main = document.querySelector('main');
  var posts;

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
  var createPostElements = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < posts.length; i++) {
      fragment.appendChild(createPostElement(posts[i]));
    }
    picturesContainer.appendChild(fragment);
  };

  var onLoadSuccess = function (data) {
    posts = data;
    createPostElements(data);

    imageFilter.classList.remove('img-filters--inactive');
    defaultOrderButton.addEventListener('click', makeDefaultOrder);
    randomOrderButton.addEventListener('click', makeRandomOrder);
    discussedOrderButton.addEventListener('click', makeDiscussedOrder);
  };

  var onLoadError = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.classList.add('error-block');
    errorBlock.textContent = errorMessage;
    main.insertAdjacentElement('afterbegin', errorBlock);
  };

  // ----------
  var MAX_COUNT_RANDOM_PHOTO = 10;

  var imageFilter = document.querySelector('.img-filters');
  var defaultOrderButton = imageFilter.querySelector('#filter-default');
  var randomOrderButton = imageFilter.querySelector('#filter-random');
  var discussedOrderButton = imageFilter.querySelector('#filter-discussed');
  var filterButtons = imageFilter.querySelectorAll('.img-filters__button');

  var removeActiveFilter = function () {
    filterButtons.forEach(function (el) {
      if (el.className.includes('img-filters__button--active')) {
        el.classList.remove('img-filters__button--active');
      }
    });
  };

  var removePhotos = function () {
    var picturesSection = document.querySelector('.pictures');
    var pictures = document.querySelectorAll('.picture');
    pictures.forEach(function (el) {
      picturesSection.removeChild(el);
    });
  };

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var mix = function (arr) {
    var randomPhotos = [];
    for (var i = MAX_COUNT_RANDOM_PHOTO; i > 0; i--) {
      var j = getRandomNumber(0, arr.length - 1);
      randomPhotos.push(arr[j]);
      arr.splice(j, 1);
    }
    return randomPhotos;
  };

  var changeFilter = function (button, data) {
    removeActiveFilter();
    button.classList.add('img-filters__button--active');
    removePhotos();
    window.debounce.debounce(createPostElements(data));
    onLoadSuccess(data);
  };

  var makeDefaultOrder = function () {
    var defaultOrderPhotos = posts.slice();
    changeFilter(defaultOrderButton, defaultOrderPhotos);
  };

  var makeRandomOrder = function () {
    var randomOrderPhotos = mix(posts.slice());
    changeFilter(randomOrderButton, randomOrderPhotos);
  };

  var makeDiscussedOrder = function () {
    var discussOrderPhotos = posts.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    changeFilter(discussedOrderButton, discussOrderPhotos);
  };

  window.backend.download(onLoadSuccess, onLoadError);
})();
