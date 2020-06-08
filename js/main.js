'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var USERNAMES = ['Аделина', 'Елена', 'Дмитрий', 'Екатерина', 'Александр', 'Юлия', 'Владислав'];
var POSTSCOUNT = 25;
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var picturesContainer = document.querySelector('.pictures');
var posts = [];

// Функция подбора случайного числа
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция для создания комментария
var createComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: COMMENTS[getRandomNumber(0, COMMENTS.length - 1)],
    name: USERNAMES[getRandomNumber(0, USERNAMES.length - 1)]
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
  for (var i = 0; i < POSTSCOUNT; i++) {
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
  for (var j = 0; j < POSTSCOUNT; j++) {
    fragment.appendChild(createPostElement(posts[j]));
  }
  picturesContainer.appendChild(fragment);
};

createPosts();
createPostElements();
