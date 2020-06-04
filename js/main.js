'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var USERS = ['Аделина', 'Елена', 'Дмитрий', 'Екатерина', 'Александр', 'Юлия', 'Владислав'];
var postsAmount = 25;
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var pictures = document.querySelector('.pictures');

// Функция подбора случайного числа
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для создания комментария
var creatingComment = function () {
  var comment = {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: COMMENTS[getRandomNumber(0, COMMENTS.length - 1)],
    name: USERS[getRandomNumber(0, USERS.length - 1)]
  };
  return comment;
};

// Функция для создание нескольких комментариев
var creatingComments = function () {
  var commentsArray = [];
  for (var i = 0; i <= getRandomNumber(1, 5); i++) {
    commentsArray.push(creatingComment());
  }
  return commentsArray;
};

// Функция для создания поста
var creatingPost = function (index) {
  var post = {
    url: 'photos/' + (index + 1) + '.jpg',
    description: 'Описание под фото',
    likes: getRandomNumber(15, 200),
    comment: creatingComments(),
  };
  return post;
};

// Функция для создания  25 постов
var posts = [];
for (var i = 0; i < postsAmount; i++) {
  posts.push(creatingPost(i));
}

// Создание DOOM элементов
var getPost = function (post) {
  var clonedPost = pictureTemplate.cloneNode(true);
  clonedPost.querySelector('.picture__img').src = post.url;
  clonedPost.querySelector('.picture__likes').textContent = post.likes;
  clonedPost.querySelector('.picture__comments').innerHTML = post.comment.length;
  return clonedPost;
};

// Отрисовка DOM элемента на странице
var fragment = document.createDocumentFragment();
for (var j = 0; j < postsAmount; j++) {
  fragment.appendChild(getPost(posts[j]));
}
pictures.appendChild(fragment);

