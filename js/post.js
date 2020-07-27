'use strict';

(function () {
  var MAX_COMMENT = 5;
  var Avatar = {
    WIDTH: 35,
    HEIGHT: 35
  };
  var comments = null;
  var renderedComments = 0;
  var body = document.querySelector('body');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var likesCount = bigPicture.querySelector('.likes-count');
  var commentsContainer = bigPicture.querySelector('.social__comments');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var closeButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var commentsButton = bigPicture.querySelector('.comments-loader');

  commentsCount.innerHTML = '';
  var currentCommentsCount = document.createElement('span');
  currentCommentsCount.classList.add('current-comments-count');
  commentsCount.appendChild(currentCommentsCount);
  commentsCount.appendChild(document.createTextNode(' из '));
  var maxCommentsCount = document.createElement('span');
  maxCommentsCount.classList.add('comments-count');
  commentsCount.appendChild(maxCommentsCount);
  commentsCount.appendChild(document.createTextNode(' комментариев'));

  var renderComments = function () {
    var length = +maxCommentsCount.textContent;
    var step = 1;
    var fragment = document.createDocumentFragment();
    for (; renderedComments <= length; renderedComments += 1) {
      currentCommentsCount.textContent = renderedComments;

      if (renderedComments === length) {
        commentsButton.classList.add('hidden');
        return;
      }
      if (comments[renderedComments]) {
        if (step > MAX_COMMENT) {
          break;
        }
        var comment = document.createElement('li');
        comment.classList.add('social__comment');

        var avatar = document.createElement('img');
        avatar.classList.add('social__picture');
        avatar.src = comments[renderedComments].avatar;
        avatar.alt = 'Аватар ' + comments[renderedComments].name;
        avatar.width = Avatar.WIDTH;
        avatar.height = Avatar.HEIGHT;

        var text = document.createElement('p');
        text.classList.add('social__text');
        text.textContent = comments[renderedComments].message;

        comment.appendChild(avatar);
        comment.appendChild(text);

        fragment.appendChild(comment);
        commentsContainer.appendChild(fragment);

        step += 1;
      }
    }
  };

  var onCommentsButtonClick = function () {
    renderComments();
  };

  var onDocumentKeydown = function (evt) {
    if (evt.key === 'Escape') {
      closeBigPicture();
    }
  };

  var onBigPictureCancelClick = function () {
    closeBigPicture();
  };

  var closeBigPicture = function () {
    renderedComments = 0;
    bigPicture.classList.add('hidden');
    commentsButton.removeEventListener('click', onCommentsButtonClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    closeButton.removeEventListener('click', onBigPictureCancelClick);
    body.classList.remove('modal-open');
    if (commentsButton.classList.contains('hidden')) {
      commentsButton.classList.remove('hidden');
    }
  };

  var showBigPicture = function (image) {
    comments = image.comments;
    commentsContainer.innerHTML = '';
    bigPictureImg.src = image.url;
    likesCount.textContent = image.likes;
    maxCommentsCount.textContent = image.comments.length;
    socialCaption.textContent = image.description;
    renderComments();
    body.classList.add('modal-open');
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onDocumentKeydown);
    closeButton.addEventListener('click', onBigPictureCancelClick);
    commentsButton.addEventListener('click', onCommentsButtonClick);
  };

  window.post = {
    showBigPicture: showBigPicture
  };

})();
