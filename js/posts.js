'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
  var picturesContainer = document.querySelector('.pictures');
  var main = document.querySelector('main');
  var imgFilters = document.querySelector('.img-filters');

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

  // по умолчанию
  var getDefaultPictures = function (pictures) {
    return pictures.slice();
  };

  // 10 случайных
  var getRandomPictures = function (pictures) {
    var randomUniqueArray = window.utils.getUniqueArray(0, pictures.length);
    var randomPictures = [];
    randomUniqueArray.forEach(function (item) {
      return randomPictures.push(pictures[item]);
    });
    return randomPictures;
  };

  // обсудаемые
  var getDiscussionPictures = function (pictures) {
    var sortCommentPictures = pictures.slice();
    sortCommentPictures.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    return sortCommentPictures;
  };

  // Функция обработки кликов по кнопкам-фильтрам
  var clickFilterButton = function (photos) {
    var buttons = imgFilters.querySelectorAll('button');
    var sortPictures = [];

    var onButtonDefaultClick = window.utils.debounce(function (evt) {
      onButtonClick(getDefaultPictures, evt);
    });

    var onButtonRandomClick = window.utils.debounce(function (evt) {
      onButtonClick(getRandomPictures, evt);
    });

    var onButtonDiscussionClick = window.utils.debounce(function (evt) {
      onButtonClick(getDiscussionPictures, evt);
    });

    var onButtonClick = function (callback, evt) {
      evt.preventDefault();
      var target = evt.target;
      if (target.type === 'button') {
        var activeButton = imgFilters.querySelector('.img-filters__button--active');
        activeButton.classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        window.utils.clearGallery('.picture', picturesContainer);
        sortPictures = callback(photos);
        createPostElements(sortPictures, picturesContainer);
      }
    };

    var addEventElement = function (element, elementId, elementFunction) {
      if (element.id === elementId) {
        element.addEventListener('click', elementFunction);
      }
    };

    buttons.forEach(function (item) {
      addEventElement(item, 'filter-default', onButtonDefaultClick);
      addEventElement(item, 'filter-random', onButtonRandomClick);
      addEventElement(item, 'filter-discussed', onButtonDiscussionClick);

    });
  };

  var onLoadSuccess = function (data) {
    createPostElements(data, picturesContainer);
    imgFilters.classList.remove('img-filters--inactive');
    clickFilterButton(data);
  };

  var onLoadError = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.classList.add('error-block');
    errorBlock.textContent = errorMessage;
    main.insertAdjacentElement('afterbegin', errorBlock);
  };
  window.backend.download(onLoadSuccess, onLoadError);
})();
