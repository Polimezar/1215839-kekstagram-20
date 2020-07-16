'use strict';

(function () {
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

  // Функция для создания комментария
  var createComment = function () {
    return {
      avatar: 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg',
      message: COMMENTS[window.utils.getRandomNumber(0, COMMENTS.length - 1)],
      name: USER_NAMES[window.utils.getRandomNumber(0, USER_NAMES.length - 1)]
    };
  };

  // Функция для создание нескольких комментариев
  var createComments = function () {
    var commentsArray = [];
    for (var i = 0; i <= window.utils.getRandomNumber(1, 5); i++) {
      commentsArray.push(createComment());
    }
    return commentsArray;
  };

  // Функция для создания поста
  var createPost = function (index) {
    return {
      url: 'photos/' + (index + 1) + '.jpg',
      description: 'И пусть весь мир подождет',
      likes: window.utils.getRandomNumber(15, 200),
      comments: createComments(),
    };
  };

  // Функция для создания  25 постов
  var createPosts = function () {
    var posts = [];
    for (var i = 0; i < POSTS_COUNT; i++) {
      posts.push(createPost(i)
      );
    }
    return posts;
  };

  window.data = {
    createPosts: createPosts
  };

})();
