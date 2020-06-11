'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var USER_NAMES = ['Аделина', 'Елена', 'Дмитрий', 'Екатерина', 'Александр', 'Юлия', 'Владислав'];
var POSTS_COUNT = 25;
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var picturesContainer = document.querySelector('.pictures');
var posts = [];
var bigPicture = document.querySelector('.big-picture');
var commentsContainer = document.querySelector('.social__comments')
var commentTemplate = document.querySelector('#comment');

// Функция подбора случайного числа
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция для создания комментария
var createComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: COMMENTS[getRandomNumber(0, COMMENTS.length - 1)],
    name: USER_NAMES[getRandomNumber(0, USER_NAMES.length - 1)]
  };
};

// Функция для создание нескольких комментариев
var createComments = function () {
  var commentsArray = [];
  for (var i = 0; i <= getRandomNumber(1, 5); i++) {
    commentsArray.push(createComment());
  }
  return commentsArray;
};

// Функция для создания поста
var createPost = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    description: 'Описание под фото',
    likes: getRandomNumber(15, 200),
    comments: createComments(),
  };
};

// Функция для создания  25 постов
var createPosts = function () {
  posts = [];
  for (var i = 0; i < POSTS_COUNT; i++) {
    posts.push(createPost(i));
  }
};

// Создание DOM элементов
var createPostElement = function (post) {
  var clonedPost = pictureTemplate.cloneNode(true);
  clonedPost.querySelector('.picture__img').src = post.url;
  clonedPost.querySelector('.picture__likes') .textContent = post.likes;
  clonedPost.querySelector('.picture__comments') .innerHTML = post.comments.length;
  return clonedPost;
};

// Отрисовка DOM элемента на странице
var createPostElements = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < POSTS_COUNT; j++) {
    fragment.appendChild(createPostElement(posts[j]));
  }
  picturesContainer.appendChild(fragment);
};

createPosts();
createPostElements();

// Заполнение bigPicture информацией из первого элемента массива
var showBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
};

showBigPicture();

bigPicture.querySelector('.big-picture__img').src = posts[0].url;
bigPicture.querySelector('.likes-count').textContent = posts[0].likes;
bigPicture.querySelector('.comments-count').textContent = posts[0].comments.length;
bigPicture.querySelector('.social__caption').textContent = posts[0].description;

// Функция удаляет комментарии по умолчанию из разметки
var  clearComments = function () {
  while (commentsContainer.firstChild) {
    commentsContainer.removeChild(commentsContainer.firstChild);
  }
};

// Функция для вставки сгенерированных комментариев в DOM
var createCommentElement = function () {
  for (var l = 0; l < posts[0].comments.length; l++) {
    var clonedComment = commentTemplate.cloneNode(true);
    clonedComment.querySelector('img').src = posts[0].comments[l].avatar;
    clonedComment.querySelector('img').alt = posts[0].comments[l].name;
    clonedComment.querySelector('.social__text').textContent = posts[0].comments[l].message;
  }
};

var createCommentElements = function (post) {
  var fragmentOfComments = document.createDocumentFragment();
  for (var l = 0; l < posts[0].comments.length; l++) {
    fragmentOfComments.appendChild(clonedComment);
  }
  clearComments();
  commentsContainer.appendChild(fragmentOfComments);
};

// Прячем блоки счётчика комментариев и загрузки новых комментариев
var hideCommentCounter = function () {
  document.querySelector('.social__comment-count').classList.add('hidden');
  document.querySelector('.comments-loader').classList.add('hidden');
};

hideCommentCounter();
createPostElement();
createPostElements(post[0]);
