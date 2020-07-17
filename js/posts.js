'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
  var picturesContainer = document.querySelector('.pictures');

  // Создание DOM элементов
  var createPostElement = function (post) {
    var clonedPost = pictureTemplate.cloneNode(true);
    clonedPost.querySelector('.picture__img').src = post.url;
    clonedPost.querySelector('.picture__likes').textContent = post.likes;
    clonedPost.querySelector('.picture__comments').textContent = post.comments.length;
    clonedPost.addEventListener('click', function () {
      window.preview.showBigPicture(post);
    });
    return clonedPost;
  };

  // Отрисовка DOM элемента на странице
  var createPostElements = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(createPostElement(photos[i]));
    }
    picturesContainer.appendChild(fragment);
  };

  var onSuccess = function (post) {
    createPostElements(post);
  };

  function onError(errorMessage) {
    var main = document.querySelector('main');
    var errorBlock = document.createElement('div');
    errorBlock.classList.add('error-block');
    errorBlock.textContent = errorMessage;
    main.insertAdjacentElement('afterbegin', errorBlock);
  }
  window.load.download(onSuccess, onError);
})();
