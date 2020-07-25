'use strict';

(function () {
  var RANDOM_ELEMENTS_COUNT = 10;

  var filtersContainer = document.querySelector('.img-filters');
  var defaultOrderButton = filtersContainer.querySelector('#filter-default');
  var randomOrderButton = filtersContainer.querySelector('#filter-random');
  var discussedOrderButton = filtersContainer.querySelector('#filter-discussed');
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

  var removePhotos = function () {
    var pictures = document.querySelectorAll('.picture');
    pictures.forEach(function (el) {
      picturesContainer.removeChild(el);
    });
  };

  // по умолчанию
  var getDefaultOrder = function () {
    return posts;
  };

  // 10 случайных
  var getRandomOrder = function () {
    return window.utils.getRandomElements(posts, RANDOM_ELEMENTS_COUNT);
  };

  // самые обсуждаемые
  var getDiscussedOrder = function () {
    return posts.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
  };

  var removeActiveFilter = function () {
    var currentFilter = filtersContainer.querySelector('.img-filters__button--active');
    currentFilter.classList.remove('img-filters__button--active');
  };

  var changeFilter = function (button, data) {
    removeActiveFilter();
    button.classList.add('img-filters__button--active');
    removePhotos();
    window.debounce.debounce(createPostElements(data));
  };

  var onLoadSuccess = function (data) {
    posts = data;
    createPostElements(data);
    filtersContainer.classList.remove('img-filters--inactive');
  };

  var onLoadError = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.classList.add('error-block');
    errorBlock.textContent = errorMessage;
    main.insertAdjacentElement('afterbegin', errorBlock);
  };

  defaultOrderButton.addEventListener('click.', function () {
    changeFilter(getDefaultOrder);
  });

  randomOrderButton.addEventListener('click.', function () {
    changeFilter(getRandomOrder);
  });

  discussedOrderButton.addEventListener('click.', function () {
    changeFilter(getDiscussedOrder);
  });

  window.backend.download(onLoadSuccess, onLoadError);
})();
