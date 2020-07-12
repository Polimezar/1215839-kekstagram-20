'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var commentTemplate = document.querySelector('#comment')
    .content
    .querySelector('.social__comment');
  var commentsContainer = document.querySelector('.social__comments');
  var body = document.querySelector('body');

  // Заполнение bigPicture информацией из первого элемента массива
  var showBigPicture = function (post) {
    setupBigPicture(post);
    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', window.preview.onEscapePress);
  };

  // Функция удаляет комментарии по умолчанию из разметки
  var clearComments = function () {
    while (commentsContainer.firstChild) {
      commentsContainer.removeChild(commentsContainer.firstChild);
    }
  };

  var createCommentElement = function (comment) {
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('img').src = comment.avatar;
    commentElement.querySelector('img').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;
    return commentElement;
  };

  // Функция для вставки сгенерированных комментариев в DOM
  var createCommentElements = function (comments) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < comments.length; i++) {
      fragment.appendChild(createCommentElement(comments[i]));
    }
    clearComments(); // Подчищаем комменты с разметки
    commentsContainer.appendChild(fragment); // Вставляем сгенерированные на страницу
  };

  var setupBigPicture = function (post) {
    bigPicture.querySelector('.big-picture__img img').src = post.url;
    bigPicture.querySelector('.likes-count').textContent = post.likes;
    bigPicture.querySelector('.comments-count').textContent = post.comments.length;
    bigPicture.querySelector('.social__caption').textContent = post.description;
    createCommentElements(post.comments);
  };

  // Прячем блоки счётчика комментариев и загрузки новых комментариев
  var hideCommentCounter = function () {
    document.querySelector('.social__comment-count').classList.add('hidden');
  };

  var hideCommentLoader = function () {
    document.querySelector('.comments-loader').classList.add('hidden');
  };

  // Закрытие фото по esc
  var onEscapePress = function (evt) {
    if (evt.key === 'Escape') {
      window.preview.closeBigPicture();
    }
  };

  // Закрытие большого фото
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', window.preview.onEscapePress);
  };

  window.preview = {
    showBigPicture: showBigPicture,
    onEscapePress: onEscapePress,
    closeBigPicture: closeBigPicture
  };

  hideCommentCounter();
  hideCommentLoader();
})();
